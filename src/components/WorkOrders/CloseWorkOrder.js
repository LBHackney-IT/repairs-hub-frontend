import PropTypes from 'prop-types'
import CloseWorkOrderForm from './CloseWorkOrderForm'
import { useState, useEffect } from 'react'
import { convertToDateFormat } from '../../utils/date'
import SummaryCloseWorkOrder from './SummaryCloseWorkOrder'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { postWorkOrderComplete } from '../../utils/frontend-api-client/work-order-complete'
import { buildCloseWorkOrderData } from '../../utils/hact/work-order-complete/close-job'
import { useRouter } from 'next/router'
import { getWorkOrder } from '../../utils/frontend-api-client/work-orders'

const CloseWorkOrder = ({ reference }) => {
  const [completionDate, setCompletionDate] = useState('')
  const [completionTime, setCompletionTime] = useState('')
  const [dateToShow, setDateToShow] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [notes, setNotes] = useState('')
  const [reason, setReason] = useState('')
  const [workOrder, setWorkOrder] = useState()

  const [CloseWorkOrderFormPage, setCloseWorkOrderFormPage] = useState(true)
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

  const getCloseWorkOrder = async () => {
    setError(null)

    try {
      const workOrder = await getWorkOrder(reference)

      setWorkOrder(workOrder)
    } catch (e) {
      setWorkOrder(null)

      console.error('An error has occured:', e.response)

      if (e.response?.status === 404) {
        setError(`Could not find a work order with reference ${reference}`)
      } else {
        setError(
          `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
        )
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getCloseWorkOrder()
  }, [])

  const onJobSubmit = async () => {
    const CloseWorkOrderFormData = buildCloseWorkOrderData(
      completionDate,
      notes,
      reference,
      reason
    )

    makePostRequest(CloseWorkOrderFormData)
  }

  const changeCurrentPage = () => {
    setCloseWorkOrderFormPage(!CloseWorkOrderFormPage)
  }

  const onGetToSummary = (e) => {
    const properDate = convertToDateFormat(e)
    setCompletionDate(properDate)

    setReason(e.reason)
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
          {!workOrder && error && <ErrorMessage label={error} />}

          {workOrder && (
            <>
              {CloseWorkOrderFormPage && (
                <CloseWorkOrderForm
                  reference={workOrder.reference}
                  onGetToSummary={onGetToSummary}
                  notes={notes}
                  time={completionTime}
                  date={completionDate}
                  reason={reason}
                />
              )}
              {!CloseWorkOrderFormPage && (
                <SummaryCloseWorkOrder
                  onJobSubmit={onJobSubmit}
                  notes={notes}
                  time={completionTime}
                  date={dateToShow}
                  reason={reason}
                  changeStep={changeCurrentPage}
                  reference={workOrder.reference}
                />
              )}
              {error && <ErrorMessage label={error} />}
            </>
          )}
        </>
      )}
    </>
  )
}

CloseWorkOrder.propTypes = {
  reference: PropTypes.string.isRequired,
}

export default CloseWorkOrder
