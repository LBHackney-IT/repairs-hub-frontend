import PropTypes from 'prop-types'
import CloseJobForm from './CloseJobForm'
import { useState } from 'react'
import { convertToDateFormat } from '../../utils/date'
import SummaryCloseJob from './SummaryCloseJob'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { postWorkOrderComplete } from '../../utils/frontend-api-client/work-order-complete'
import { buildCloseJobData } from '../../utils/hact/work-order-complete/close-job'
import { useRouter } from 'next/router'

const CloseJob = ({ reference }) => {
  const [completionDate, setCompletionDate] = useState('')
  const [completionTime, setCompletionTime] = useState('')
  const [dateToShow, setDateToShow] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [notes, setNotes] = useState('')

  const [closeJobFormPage, setCloseJobFormPage] = useState(true)
  const router = useRouter()

  const makePostRequest = async (formData) => {
    setLoading(true)

    try {
      await postWorkOrderComplete(formData)
      router.push('/')
    } catch (e) {
      console.error(e)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
      setLoading(false)
    }
  }

  const onJobSubmit = async () => {
    const closeJobFormData = buildCloseJobData(completionDate, notes, reference)

    makePostRequest(closeJobFormData)
  }

  const changeCurrentPage = () => {
    setCloseJobFormPage(!closeJobFormPage)
  }

  const onGetToSummary = (e) => {
    const properDate = convertToDateFormat(e)
    setCompletionDate(properDate)

    setNotes(e.notes)
    setDateToShow(e.date)
    changeCurrentPage()
    setCompletionTime(e.time)
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {closeJobFormPage && (
            <CloseJobForm
              reference={reference}
              onGetToSummary={onGetToSummary}
              notes={notes}
              time={completionTime}
              date={completionDate}
            />
          )}
          {!closeJobFormPage && (
            <SummaryCloseJob
              onJobSubmit={onJobSubmit}
              notes={notes}
              time={completionTime}
              date={dateToShow}
              changeStep={changeCurrentPage}
              reference={reference}
            />
          )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

CloseJob.propTypes = {
  reference: PropTypes.string.isRequired,
}

export default CloseJob
