import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import BackButton from '../../Layout/BackButton'
import ErrorMessage from '../../Errors/ErrorMessage'
import {
  fetchFeatureToggles,
  frontEndApiRequest,
} from '@/utils/frontEndApiClient/requests'
import { updateExistingTasksQuantities } from '@/utils/updateTasks'
import { isSpendLimitReachedResponse } from '@/utils/helpers/apiResponses'
import WorkOrderUpdateForm from './Form'
import WorkOrderUpdateSummary from './Summary'
import {
  MULTITRADE_SOR_INCREMENTAL_SEARCH_ENABLED_KEY,
  PURDY_CONTRACTOR_REFERENCE,
} from '@/utils/constants'
import SuccessPage from '../../SuccessPage/index'
import { updateWorkOrderLinks, generalLinks } from '@/utils/successPageLinks'
import PageAnnouncement from '@/components/Template/PageAnnouncement'

const WorkOrderUpdateView = ({ reference }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [currentUser, setCurrentUser] = useState({})
  const [tasks, setTasks] = useState([])
  const [originalTasks, setOriginalTasks] = useState([])
  const [workOrder, setWorkOrder] = useState()
  const [variationReason, setVariationReason] = useState('')
  const [addedTasks, setAddedTasks] = useState([])
  const [showSummaryPage, setShowSummaryPage] = useState(false)
  const [
    showAdditionalRateScheduleItems,
    setShowAdditionalRateScheduleItems,
  ] = useState(false)
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false)
  const [overSpendLimit, setOverSpendLimit] = useState()
  const [budgetCode, setBudgetCode] = useState()
  const [contractorReference, setContractorReference] = useState()
  const [
    orderRequiresIncrementalSearch,
    setOrderRequiresIncrementalSearch,
  ] = useState()
  const [sorCodeArrays, setSorCodeArrays] = useState([[]])

  const onGetToSummary = (e) => {
    updateExistingTasksQuantities(e, tasks)

    setAddedTasks(
      e.rateScheduleItems
        ? e.rateScheduleItems
            .filter((e) => e != null)
            .map((e, index) => {
              return { id: index, ...e, code: e.code.split(' - ')[0] }
            })
        : []
    )

    setShowSummaryPage(true)
  }

  const changeCurrentPage = () => {
    setShowAdditionalRateScheduleItems(true)
    setShowSummaryPage(false)
  }

  const onFormSubmit = async (formData, overSpendLimit) => {
    setLoading(true)

    try {
      await frontEndApiRequest({
        method: 'post',
        path: `/api/jobStatusUpdate`,
        requestData: formData,
      })
      setOverSpendLimit(overSpendLimit)
      setShowUpdateSuccess(true)
    } catch (e) {
      console.error(e)

      if (isSpendLimitReachedResponse(e.response)) {
        setError(
          `Variation cost exceeds £${currentUser?.varyLimit}, please contact your contract manager to vary on your behalf`
        )
      } else {
        setError(
          `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
        )
      }
    }

    setLoading(false)
  }

  const sorSearchRequest = (searchText) => 
    frontEndApiRequest({
      method: 'get',
      path: '/api/schedule-of-rates/codes',
      params: {
        tradeCode: workOrder.tradeCode,
        propertyReference: workOrder.propertyReference,
        contractorReference: workOrder.contractorReference,
        showAllTrades: true,
        filter: searchText,
      },
    })

  const incrementalSORSearchRequired = async (contractorRef) => {
    const orderApplicable = contractorRef === PURDY_CONTRACTOR_REFERENCE

    if (!orderApplicable) {
      setOrderRequiresIncrementalSearch(false)
      return false
    }

    const featureToggles = await fetchFeatureToggles()

    const multiTradeSORIncrementalSearchEnabled = !!featureToggles[
      MULTITRADE_SOR_INCREMENTAL_SEARCH_ENABLED_KEY
    ]

    setOrderRequiresIncrementalSearch(
      orderApplicable && multiTradeSORIncrementalSearchEnabled
    )

    return orderApplicable && multiTradeSORIncrementalSearchEnabled
  }

  const getWorkOrderUpdateForm = async (reference) => {
    setError(null)

    try {
      const currentUser = await frontEndApiRequest({
        method: 'get',
        path: '/api/hub-user',
      })

      const workOrder = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${reference}`,
      })

      const tasks = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${reference}/tasks`,
      })

      const multiTradeIncrementalSearch = await incrementalSORSearchRequired(
        workOrder.contractorReference
      )

      if (!multiTradeIncrementalSearch) {
        const sorCodes = await frontEndApiRequest({
          path: '/api/schedule-of-rates/codes',
          method: 'get',
          params: {
            tradeCode: workOrder.tradeCode,
            propertyReference: workOrder.propertyReference,
            contractorReference: workOrder.contractorReference,
            showAdditionalTrades: true,
          },
        })

        setSorCodeArrays([sorCodes])
      }

      setOrderRequiresIncrementalSearch(multiTradeIncrementalSearch)
      setWorkOrder(workOrder)
      setCurrentUser(currentUser)
      setBudgetCode(workOrder.budgetCode)
      setTasks(tasks)
      setOriginalTasks(tasks.filter((t) => t.original))
      setContractorReference(workOrder.contractorReference)
    } catch (e) {
      setCurrentUser(null)
      setSorCodeArrays([[]])
      setTasks(null)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getWorkOrderUpdateForm(reference)
  }, [])
  
  console.log('tasks')
console.log(tasks)
console.log('Original tasks')
console.log(originalTasks)
console.log('added tasks')
console.log(addedTasks)
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {currentUser && tasks && (
            <>
              {showUpdateSuccess && (
                <SuccessPage
                  banner={
                    <PageAnnouncement
                      title={
                        overSpendLimit
                          ? 'Variation requires authorisation'
                          : 'Work order updated'
                      }
                      workOrderReference={reference}
                    />
                  }
                  links={
                    overSpendLimit
                      ? generalLinks(reference)
                      : updateWorkOrderLinks(reference)
                  }
                  warningText={
                    overSpendLimit
                      ? 'Please request authorisation from a manager'
                      : ''
                  }
                />
              )}
              {!showSummaryPage && !showUpdateSuccess && (
                <>
                  <BackButton />
                  <h1 className="lbh-heading-h1">
                    Update work order: {reference}
                  </h1>

                  <WorkOrderUpdateForm
                    latestTasks={tasks}
                    originalTasks={originalTasks}
                    addedTasks={addedTasks}
                    showAdditionalRateScheduleItems={
                      showAdditionalRateScheduleItems
                    }
                    onGetToSummary={onGetToSummary}
                    setVariationReason={setVariationReason}
                    variationReason={variationReason}
                    contractorReference={contractorReference}
                    sorSearchRequest={
                      orderRequiresIncrementalSearch && sorSearchRequest
                    }
                    sorCodeArrays={sorCodeArrays}
                    setSorCodeArrays={setSorCodeArrays}
                  />
                </>
              )}
              {showSummaryPage && !showUpdateSuccess && (
                <WorkOrderUpdateSummary
                  latestTasks={tasks}
                  originalTasks={originalTasks}
                  addedTasks={addedTasks}
                  varySpendLimit={parseFloat(currentUser.varyLimit)}
                  reference={reference}
                  onFormSubmit={onFormSubmit}
                  changeStep={changeCurrentPage}
                  variationReason={variationReason}
                  budgetCode={budgetCode}
                />
              )}
              {currentPage === ADDING_MULTIPLE_SOR_PAGE && (
                <AddMultipleSORs
                  setPageBackToFormView={() => setCurrentPage(FORM_PAGE)}
                  // Callback to do further validation if necessary
                  // It will receive the SORs that passed the validation
                  sorExistenceValidationCallback={async (sorCodesThatPassedValidation) => {
                    const validationResults = {
                      allCodesValid: true,
                      validCodes: [...sorCodesThatPassedValidation],
                      invalidCodes: [],
                    }

                    console.log(sorCodesThatPassedValidation)
                    // populate/fill validationResults

                    return validationResults}}

                  setSorCodesFromBatchUpload={()=> {}}
                  // This function will be called with the announcement message,
                  // which can be used to render the message (see renderAnnouncement in RaiseWorkOrderFormView)
                  setAnnouncementMessage={(msg) => console.log(msg)}
                  setIsPriorityEnabled={(isEnabled) => {}}
                />
              )}
            </>
          )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

WorkOrderUpdateView.propTypes = {
  reference: PropTypes.string.isRequired,
}

export default WorkOrderUpdateView
