import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../Spinner/Spinner'
import BackButton from '../Layout/BackButton/BackButton'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { getTasks } from '../../utils/frontend-api-client/tasks'
import { getSorCodes } from '../../utils/frontend-api-client/schedule-of-rates/codes'
import UpdateJobForm from './UpdateJobForm'
import SummaryUpdateJob from './SummaryUpdateJob'
import { updatedTasks } from '../../utils/update-job'
import { buildUpdateJob } from '../../utils/hact/update-job'
import { postJobStatusUpdate } from '../../utils/frontend-api-client/job-status-update'
import { useRouter } from 'next/router'

const UpdateJob = ({ reference }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [sorCodes, setSorCodes] = useState([])
  const [rateScheduleItems, setRateScheduleItems] = useState([])
  const [showSummaryPage, setShowSummaryPage] = useState(false)
  const [
    showAdditionalRateScheduleItems,
    setShowAdditionalRateScheduleItems,
  ] = useState(false)
  const router = useRouter()

  const onGetToSummary = (e) => {
    const allTasks = updatedTasks(e, tasks.length)
    setRateScheduleItems(
      e.rateScheduleItems
        ? e.rateScheduleItems
            .filter((e) => e != null)
            .map((e, index) => {
              return { id: index, ...e }
            })
        : []
    )

    setTasks(allTasks)
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
      reference
    )
    makePostRequest(updateJobFormData)
  }

  const makePostRequest = async (formData) => {
    setLoading(true)

    try {
      await postJobStatusUpdate(formData)
      router.push('/')
    } catch (e) {
      console.log(e)
      setError(
        `Oops an error occurred with error status: ${e.response?.status}`
      )
      setLoading(false)
    }
  }

  const getWorkOrder = async (reference) => {
    setError(null)

    try {
      const tasks = await getTasks(reference)
      // FIXME: Hardcoding temporarily to not break staging
      const sorCodes = await getSorCodes('PL', '00012345', 'H01')

      setSorCodes(sorCodes)
      setTasks(tasks)
    } catch (e) {
      setTasks(null)
      setSorCodes([])
      setError(
        `Oops an error occurred with error status: ${e.response?.status}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getWorkOrder(reference)
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {tasks && sorCodes && (
            <>
              {!showSummaryPage && (
                <>
                  <BackButton />
                  <h1 className="govuk-heading-l">
                    Update work order: {reference}
                  </h1>

                  <UpdateJobForm
                    tasks={tasks}
                    sorCodes={sorCodes}
                    showAdditionalRateScheduleItems={
                      showAdditionalRateScheduleItems
                    }
                    rateScheduleItems={
                      rateScheduleItems ? rateScheduleItems : null
                    }
                    onGetToSummary={onGetToSummary}
                  />
                </>
              )}
              {showSummaryPage && (
                <SummaryUpdateJob
                  rateScheduleItems={
                    rateScheduleItems ? rateScheduleItems : null
                  }
                  tasks={tasks}
                  reference={reference}
                  onJobSubmit={onJobUpdateSubmit}
                  changeStep={changeCurrentPage}
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
