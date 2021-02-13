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
import { postUpdateJob } from '../../utils/frontend-api-client/work-orders'
import { useRouter } from 'next/router'

const UpdateJob = ({ reference }) => {
  const [task, setTask] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [sorCodes, setSorCodes] = useState([])
  const [sorCodesCollection, setSorCodesCollection] = useState([])
  const [showSummaryPage, setShowSummaryPage] = useState(false)
  const [showAddedSoreCodes, setShowAddedSoreCodes] = useState(false)
  const router = useRouter()

  const onGetToSummary = (e) => {
    const tasks = updatedTasks(e, task.length)
    setSorCodesCollection(
      e.sorCodesCollection
        ? e.sorCodesCollection
            .filter((e) => e != null)
            .map((e, index) => {
              return { id: index, ...e }
            })
        : []
    )

    setTask(tasks)
    setShowSummaryPage(true)
  }

  const changeCurrentPage = () => {
    setShowAddedSoreCodes(true)
    setShowSummaryPage(false)
  }

  const onJobUpdateSubmit = () => {
    const updateJobFormData = buildUpdateJob(
      task,
      sorCodesCollection,
      reference
    )
    makePostRequest(updateJobFormData)
  }

  const makePostRequest = async (formData) => {
    setLoading(true)

    try {
      await postUpdateJob(formData)
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
      const task = await getTasks(reference)
      const sorCodes = await getSorCodes()

      setSorCodes(sorCodes)
      setTask(task)
    } catch (e) {
      setTask(null)
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
          {task && sorCodes && (
            <>
              {!showSummaryPage && (
                <>
                  <BackButton />
                  <h1 className="govuk-heading-l">
                    Update work order: {reference}
                  </h1>

                  <UpdateJobForm
                    task={task}
                    sorCodes={sorCodes}
                    showAddedSoreCodes={showAddedSoreCodes}
                    sorCodesCollection={
                      sorCodesCollection ? sorCodesCollection : null
                    }
                    onGetToSummary={onGetToSummary}
                  />
                </>
              )}
              {showSummaryPage && (
                <SummaryUpdateJob
                  sorCodesCollection={
                    sorCodesCollection ? sorCodesCollection : null
                  }
                  task={task}
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
