import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import BackButton from '../../Layout/BackButton'
import ErrorMessage from '../../Errors/ErrorMessage'
import {
  createSorExistenceValidator,
  frontEndApiRequest,
} from '@/utils/frontEndApiClient/requests'
import { updateExistingTasksQuantities } from '@/utils/updateTasks'
import { isSpendLimitReachedResponse } from '@/utils/helpers/apiResponses'
import WorkOrderUpdateForm from './Form'
import WorkOrderUpdateSummary from './Summary'
import { MULTITRADE_ENABLED_CONTRACTORS } from '@/utils/constants'
import SuccessPage from '../../SuccessPage/index'
import { updateWorkOrderLinks, generalLinks } from '@/utils/successPageLinks'
import PageAnnouncement from '@/components/Template/PageAnnouncement'
import AddMultipleSORs from '@/components/Property/RaiseWorkOrder/AddMultipleSORs'
import { WorkOrder } from '@/root/src/models/workOrder'

interface CurrentUser {
  name: string
  email: string
  varyLimit: string
  raiseLimit: string
  contractors: any[]
  operativePayrollNumber: string
  isOneJobAtATime: boolean
}

interface Props {
  reference: string
  mobileViewLinks?: { href: string; text: string }[]
}

const WorkOrderUpdateView = (props: Props) => {
  const { reference, mobileViewLinks } = props

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>()
  const [currentUser, setCurrentUser] = useState<CurrentUser>()
  const [tasks, setTasks] = useState([])
  const [originalTasks, setOriginalTasks] = useState([])
  const [workOrder, setWorkOrder] = useState<WorkOrder>()
  const [variationReason, setVariationReason] = useState('')
  const [addedTasks, setAddedTasks] = useState([])
  const [showSummaryPage, setShowSummaryPage] = useState(false)
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false)
  const [overSpendLimit, setOverSpendLimit] = useState()
  const [budgetCode, setBudgetCode] = useState()
  const [contractorReference, setContractorReference] = useState<string>()
  const [
    orderRequiresIncrementalSearch,
    setOrderRequiresIncrementalSearch,
  ] = useState<any>()

  const [sorCodeArrays, setSorCodeArrays] = useState([[]])

  const FORM_PAGE = 1
  const ADDING_MULTIPLE_SOR_PAGE = 2
  const [currentPage, setCurrentPage] = useState(FORM_PAGE)

  //multiple SORs
  const [formState, setFormState] = useState<any>()
  const [announcementMessage, setAnnouncementMessage] = useState('')

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
    setShowSummaryPage(false)
  }

  const onFormSubmit = async (formData, overSpendLimit) => {
    setIsLoading(true)

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
          `Oops an error occurred with error status: ${
            e.response?.status
          } with message: ${JSON.stringify(e.response?.data?.message)}`
        )
      }
    }

    setIsLoading(false)
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
    const orderApplicable = MULTITRADE_ENABLED_CONTRACTORS.includes(
      contractorRef
    )

    if (!orderApplicable) {
      setOrderRequiresIncrementalSearch(false)
      return false
    }

    setOrderRequiresIncrementalSearch(orderApplicable)

    return orderApplicable
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
        `Oops an error occurred with error status: ${
          e.response?.status
        } with message: ${JSON.stringify(e.response?.data?.message)}`
      )
    }

    setIsLoading(false)
  }

  const getCurrentSORCodes = () => {
    if (formState != null && formState.rateScheduleItems == null) {
      formState.rateScheduleItems = []
    }

    return [
      ...formState?.rateScheduleItems.map((rsi) => rsi.code.split(' - ')[0]),
      ...tasks.map((rsi) => rsi.code),
    ]
  }

  const renderAnnouncement = () => {
    return (
      announcementMessage && (
        <section className="lbh-page-announcement">
          <div className="lbh-page-announcement__content">
            <strong className="govuk-!-font-size-24">
              {announcementMessage}
            </strong>
          </div>
        </section>
      )
    )
  }

  useEffect(() => {
    setIsLoading(true)

    getWorkOrderUpdateForm(reference)
  }, [])

  // implementing multiple SORs update
  const setSorCodesFromBatchUpload = (sorCodes) => {
    if (formState != null && formState.rateScheduleItems == null) {
      formState.rateScheduleItems = []
    }
    const updatedFormState = {
      ...formState,
      rateScheduleItems: [
        ...formState?.rateScheduleItems.filter((rsi) => rsi.code !== ''),
        ...sorCodes.map((code) => ({
          code: `${code.code} - ${code.shortDescription}`,
          cost: code.cost.toString(),
          description: code.shortDescription,
        })),
      ],
    }

    setFormState(updatedFormState)
    const newAddedTasks = updatedFormState.rateScheduleItems
      ? updatedFormState.rateScheduleItems
          .filter((e) => e != null)
          .map((e, index) => {
            return { id: index, ...e, code: e.code.split(' - ')[0] }
          })
      : []

    setAddedTasks(newAddedTasks)
    let codes = [...sorCodeArrays]
    sorCodes.forEach((code) => {
      const detailCode = {
        code: `${code.code}`,
        shortDescription: `${code.shortDescription}`,
      }

      codes.push([detailCode])
    })

    codes = codes.filter((ar) => ar.length !== 0)

    setSorCodeArrays(codes)
  }

  const getSuccessPageLinks = () => {
    if (mobileViewLinks) return mobileViewLinks
    if (overSpendLimit) return generalLinks(reference)
    return updateWorkOrderLinks(reference)
  }

  if (isLoading) {
    return <Spinner />
  }

  if (!currentUser || !tasks) {
    return null
  }

  return (
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
          links={getSuccessPageLinks()}
          warningText={
            overSpendLimit ? 'Please request authorisation from a manager' : ''
          }
        />
      )}

      {renderAnnouncement()}
      {currentPage === FORM_PAGE && !showUpdateSuccess && !showSummaryPage && (
        <>
          <BackButton />
          <h1 className="lbh-heading-h1">Update work order: {reference}</h1>

          <WorkOrderUpdateForm
            latestTasks={tasks}
            originalTasks={originalTasks}
            addedTasks={addedTasks}
            onGetToSummary={onGetToSummary}
            setVariationReason={setVariationReason}
            variationReason={variationReason}
            contractorReference={contractorReference}
            sorSearchRequest={
              orderRequiresIncrementalSearch && sorSearchRequest
            }
            sorCodeArrays={sorCodeArrays}
            setSorCodeArrays={setSorCodeArrays}
            setPageToMultipleSORs={(formState) => {
              setAnnouncementMessage('')
              setFormState(formState)
              setCurrentPage(ADDING_MULTIPLE_SOR_PAGE)
            }}
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
          currentSorCodes={getCurrentSORCodes()}
          setPageBackToFormView={() => {
            setCurrentPage(FORM_PAGE)
          }}
          sorExistenceValidationCallback={createSorExistenceValidator(
            workOrder.tradeCode,
            workOrder.propertyReference,
            workOrder.contractorReference
          )}
          setSorCodesFromBatchUpload={setSorCodesFromBatchUpload}
          setAnnouncementMessage={setAnnouncementMessage}
          setIsPriorityEnabled={() => {}}
        />
      )}

      {error && <ErrorMessage label={error} />}
    </>
  )
}

export default WorkOrderUpdateView
