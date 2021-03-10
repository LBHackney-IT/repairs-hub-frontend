import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../Spinner/Spinner'
import BackButton from '../Layout/BackButton/BackButton'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { getCurrentUser } from '../../utils/frontend-api-client/hub-user'
import { getRepair } from '../../utils/frontend-api-client/repairs'
import { getTasks } from '../../utils/frontend-api-client/tasks'
import UpdateJobForm from './UpdateJobForm'
import SummaryUpdateJob from './SummaryUpdateJob'
import { updateExistingTasksQuantities } from '../../utils/update-job'
import { postJobStatusUpdate } from '../../utils/frontend-api-client/job-status-update'
import { getHubUser } from '../../utils/frontend-api-client/user'
import { isSpendLimitReachedResponse } from '../../utils/helpers/api-responses'
import { useRouter } from 'next/router'

const UpdateJob = ({ reference }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [currentUser, setCurrentUser] = useState({})
  const [tasks, setTasks] = useState([])
  const [originalTasks, setOriginalTasks] = useState([])
  const [userData, setUserData] = useState()
  const [propertyReference, setPropertyReference] = useState('')
  const [variationReason, setVariationReason] = useState('')
  const [addedTasks, setAddedTasks] = useState([])
  const [showSummaryPage, setShowSummaryPage] = useState(false)
  const [
    showAdditionalRateScheduleItems,
    setShowAdditionalRateScheduleItems,
  ] = useState(false)
  const router = useRouter()

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

  const onFormSubmit = async (formData) => {
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

  const getUpdateJobForm = async (reference) => {
    setError(null)

    try {
      const currentUser = await getCurrentUser()
      const workOrder = await getRepair(reference)
      const tasks = await getTasks(reference)
      const user = await getHubUser()

      setCurrentUser(currentUser)
      setTasks(tasks)
      setOriginalTasks(tasks.filter((t) => t.original))
      setPropertyReference(workOrder.propertyReference)
      setUserData(user)
    } catch (e) {
      setCurrentUser(null)
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

    getUpdateJobForm(reference)
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {currentUser && tasks && propertyReference && (
            <>
              {!showSummaryPage && (
                <>
                  <BackButton />
                  <h1 className="govuk-heading-l">
                    Update work order: {reference}
                  </h1>

                  <UpdateJobForm
                    latestTasks={tasks}
                    originalTasks={originalTasks}
                    addedTasks={addedTasks}
                    propertyReference={propertyReference}
                    showAdditionalRateScheduleItems={
                      showAdditionalRateScheduleItems
                    }
                    onGetToSummary={onGetToSummary}
                    setVariationReason={setVariationReason}
                    variationReason={variationReason}
                  />
                </>
              )}
              {showSummaryPage && (
                <SummaryUpdateJob
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

UpdateJob.propTypes = {
  reference: PropTypes.string.isRequired,
}

export default UpdateJob
