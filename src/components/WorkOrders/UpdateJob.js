import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../Spinner/Spinner'
import BackButton from '../Layout/BackButton/BackButton'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { getRepair } from '../../utils/frontend-api-client/repairs'
import { getTasks } from '../../utils/frontend-api-client/tasks'
import UpdateJobForm from './UpdateJobForm'
import SummaryUpdateJob from './SummaryUpdateJob'
import { updateExistingTasksQuantities } from '../../utils/update-job'
import { buildUpdateJob } from '../../utils/hact/job-status-update/update-job'
import { postJobStatusUpdate } from '../../utils/frontend-api-client/job-status-update'
import { getHubUser } from '../../utils/frontend-api-client/user'
import { isSpendLimitReachedResponse } from '../../utils/helpers/api-responses'
import { useRouter } from 'next/router'

const UpdateJob = ({ reference }) => {
  const [tasks, setTasks] = useState([])
  const [originalTasks, setOriginalTasks] = useState([])
  const [userData, setUserData] = useState()
  const [propertyReference, setPropertyReference] = useState('')
  const [variationReason, setVariationReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [rateScheduleItems, setRateScheduleItems] = useState([])
  const [showSummaryPage, setShowSummaryPage] = useState(false)
  const [
    showAdditionalRateScheduleItems,
    setShowAdditionalRateScheduleItems,
  ] = useState(false)
  const router = useRouter()

  const onGetToSummary = (e) => {
    updateExistingTasksQuantities(e, tasks)

    setRateScheduleItems(
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

  const onJobUpdateSubmit = () => {
    const updateJobFormData = buildUpdateJob(
      tasks,
      rateScheduleItems,
      reference,
      variationReason
    )
    makePostRequest(updateJobFormData)
  }

  const makePostRequest = async (formData) => {
    setLoading(true)

    try {
      await postJobStatusUpdate(formData)
      router.push('/')
    } catch (e) {
      console.error(e)

      if (isSpendLimitReachedResponse(e.response)) {
        setError(
          `Variation cost exceeds £${userData?.varyLimit}, please contact your contract manager to vary on your behalf`
        )
      } else {
        setError(
          `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
        )
      }

      setLoading(false)
    }
  }

  const getWorkOrderAndTasks = async (reference) => {
    setError(null)

    try {
      const workOrder = await getRepair(reference)
      const tasks = await getTasks(reference)
      const user = await getHubUser()

      setTasks(tasks)
      setOriginalTasks(tasks.filter((t) => t.original))
      setPropertyReference(workOrder.propertyReference)
      setUserData(user)
    } catch (e) {
      setTasks(null)
      setPropertyReference(null)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getWorkOrderAndTasks(reference)
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {tasks && propertyReference && (
            <>
              {!showSummaryPage && (
                <>
                  <BackButton />
                  <h1 className="govuk-heading-l">
                    Update work order: {reference}
                  </h1>

                  <UpdateJobForm
                    tasks={tasks}
                    propertyReference={propertyReference}
                    showAdditionalRateScheduleItems={
                      showAdditionalRateScheduleItems
                    }
                    addedTasks={rateScheduleItems}
                    onGetToSummary={onGetToSummary}
                    setVariationReason={setVariationReason}
                    variationReason={variationReason}
                  />
                </>
              )}
              {showSummaryPage && (
                <SummaryUpdateJob
                  addedTasks={rateScheduleItems}
                  originalTasks={originalTasks}
                  tasks={tasks}
                  reference={reference}
                  onJobSubmit={onJobUpdateSubmit}
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

UpdateJob.propTypes = {
  reference: PropTypes.string.isRequired,
}

export default UpdateJob
