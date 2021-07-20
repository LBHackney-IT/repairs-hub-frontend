import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../Spinner/Spinner'
import BackButton from '../Layout/BackButton/BackButton'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { frontEndApiRequest } from '../../utils/frontend-api-client/requests'
import UpdateWorkOrderForm from './UpdateWorkOrderForm'
import SummaryUpdateWorkOrder from './SummaryUpdateWorkOrder'
import { updateExistingTasksQuantities } from '../../utils/update-tasks'
import { postJobStatusUpdate } from '../../utils/frontend-api-client/job-status-update'
import { isSpendLimitReachedResponse } from '../../utils/helpers/api-responses'
import UpdateWorkOrderSuccess from './UpdateWorkOrderSuccess'

const UpdateWorkOrder = ({ reference }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [currentUser, setCurrentUser] = useState({})
  const [tasks, setTasks] = useState([])
  const [originalTasks, setOriginalTasks] = useState([])
  const [propertyReference, setPropertyReference] = useState('')
  const [contractorReference, setContractorReference] = useState('')
  const [variationReason, setVariationReason] = useState('')
  const [addedTasks, setAddedTasks] = useState([])
  const [showSummaryPage, setShowSummaryPage] = useState(false)
  const [
    showAdditionalRateScheduleItems,
    setShowAdditionalRateScheduleItems,
  ] = useState(false)
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false)
  const [overSpendLimit, setOverSpendLimit] = useState()

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
      await postJobStatusUpdate(formData)

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

  const getUpdateWorkOrderForm = async (reference) => {
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

      setCurrentUser(currentUser)
      setTasks(tasks)
      setOriginalTasks(tasks.filter((t) => t.original))
      setPropertyReference(workOrder.propertyReference)
      setContractorReference(workOrder.contractorReference)
    } catch (e) {
      setCurrentUser(null)
      setTasks(null)
      setPropertyReference(null)
      setContractorReference(null)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getUpdateWorkOrderForm(reference)
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {currentUser && tasks && propertyReference && (
            <>
              {showUpdateSuccess && (
                <>
                  <UpdateWorkOrderSuccess
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

                  <UpdateWorkOrderForm
                    latestTasks={tasks}
                    originalTasks={originalTasks}
                    addedTasks={addedTasks}
                    propertyReference={propertyReference}
                    contractorReference={contractorReference}
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
                <SummaryUpdateWorkOrder
                  latestTasks={tasks}
                  originalTasks={originalTasks}
                  addedTasks={addedTasks}
                  varySpendLimit={parseFloat(currentUser.varyLimit)}
                  reference={reference}
                  onFormSubmit={onFormSubmit}
                  changeStep={changeCurrentPage}
                  variationReason={variationReason}
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

UpdateWorkOrder.propTypes = {
  reference: PropTypes.string.isRequired,
}

export default UpdateWorkOrder
