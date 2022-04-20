import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import BackButton from '../../Layout/BackButton'
import ErrorMessage from '../../Errors/ErrorMessage'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { updateExistingTasksQuantities } from '@/utils/updateTasks'
import { isSpendLimitReachedResponse } from '@/utils/helpers/apiResponses'
import WorkOrderUpdateForm from './Form'
import WorkOrderUpdateSummary from './Summary'
import WorkOrderUpdateSuccess from './Success'

const WorkOrderUpdateView = ({ reference }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [currentUser, setCurrentUser] = useState({})
  const [tasks, setTasks] = useState([])
  const [originalTasks, setOriginalTasks] = useState([])
  const [sorCodes, setSorCodes] = useState([])
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

  const onGetToSummary = (e) => {
    updateExistingTasksQuantities(e, tasks)

    setAddedTasks(
      e.rateScheduleItems
        ? e.rateScheduleItems
            .filter((e) => e != null)
            .map((e, index) => {
              return { id: index, ...e }
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

      setCurrentUser(currentUser)
      setBudgetCode(workOrder.budgetCode)
      setTasks(tasks)
      setOriginalTasks(tasks.filter((t) => t.original))
      setSorCodes(sorCodes)
    } catch (e) {
      setCurrentUser(null)
      setTasks(null)
      setSorCodes([])
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

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {currentUser && tasks && sorCodes && (
            <>
              {showUpdateSuccess && (
                <>
                  <WorkOrderUpdateSuccess
                    workOrderReference={reference}
                    requiresAuthorisation={overSpendLimit}
                  />
                </>
              )}
              {!showSummaryPage && !showUpdateSuccess && (
                <>
                  <BackButton />
                  <h1 className="lbh-heading-h1">
                    Update work order: {reference}
                  </h1>

                  <WorkOrderUpdateForm
                    sorCodes={sorCodes}
                    latestTasks={tasks}
                    originalTasks={originalTasks}
                    addedTasks={addedTasks}
                    showAdditionalRateScheduleItems={
                      showAdditionalRateScheduleItems
                    }
                    onGetToSummary={onGetToSummary}
                    setVariationReason={setVariationReason}
                    variationReason={variationReason}
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
