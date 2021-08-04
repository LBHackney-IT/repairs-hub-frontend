import PropTypes from 'prop-types'
import CloseWorkOrderForm from './CloseWorkOrderForm'
import { useState, useEffect } from 'react'
import { convertToDateFormat } from '../../utils/date'
import SummaryCloseWorkOrder from './SummaryCloseWorkOrder'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { buildCloseWorkOrderData } from '../../utils/hact/workOrderComplete/closeWorkOrder'
import { useRouter } from 'next/router'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import { buildOperativeAssignmentFormData } from '../../utils/hact/workOrderStatusUpdate/assignOperatives'
import { uniqueArrayValues } from '../../utils/helpers/array'
import { WorkOrder } from '../../models/workOrder'

const CloseWorkOrder = ({ reference }) => {
  const [completionDate, setCompletionDate] = useState('')
  const [completionTime, setCompletionTime] = useState('')
  const [dateToShow, setDateToShow] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [notes, setNotes] = useState('')
  const [reason, setReason] = useState('')
  const [availableOperatives, setAvailableOperatives] = useState([])
  const [selectedOperatives, setSelectedOperatives] = useState([])
  const [workOrder, setWorkOrder] = useState()

  const [CloseWorkOrderFormPage, setCloseWorkOrderFormPage] = useState(true)
  const router = useRouter()

  const makePostRequest = async (
    workOrderCompleteFormData,
    operativeAssignmentFormData
  ) => {
    setLoading(true)

    try {
      if (workOrder.canAssignOperative) {
        frontEndApiRequest({
          method: 'post',
          path: `/api/jobStatusUpdate`,
          requestData: operativeAssignmentFormData,
        }).then(() => {
          frontEndApiRequest({
            method: 'post',
            path: `/api/workOrderComplete`,
            requestData: workOrderCompleteFormData,
          })
        })
      } else {
        frontEndApiRequest({
          method: 'post',
          path: `/api/workOrderComplete`,
          requestData: workOrderCompleteFormData,
        })
      }
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
      const workOrder = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${reference}`,
      })
      setWorkOrder(new WorkOrder(workOrder))

      if (workOrder.canAssignOperative) {
        setSelectedOperatives(workOrder.operatives)

        const operatives = await frontEndApiRequest({
          method: 'get',
          path: `/api/operatives`,
        })
        setAvailableOperatives(operatives)
      }
    } catch (e) {
      setWorkOrder(null)
      setAvailableOperatives([])

      console.error('An error has occured:', e.response)

      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getCloseWorkOrder()
  }, [])

  const onJobSubmit = async () => {
    const operativeIds = selectedOperatives.map((operative) => operative.id)

    const deduplicatedOperatives = uniqueArrayValues(
      operativeIds
    ).map((operativeId) =>
      selectedOperatives.find((operative) => operative.id === operativeId)
    )

    const operativeAssignmentFormData = buildOperativeAssignmentFormData(
      reference,
      deduplicatedOperatives
    )

    const fullNotes =
      deduplicatedOperatives.length > 0
        ? [
            notes,
            `Assigned operatives ${deduplicatedOperatives
              .map((operative) => operative.name)
              .join(', ')}`,
          ]
            .filter((s) => s)
            .join(' - ')
        : notes

    const CloseWorkOrderFormData = buildCloseWorkOrderData(
      completionDate,
      fullNotes,
      reference,
      reason
    )

    makePostRequest(CloseWorkOrderFormData, operativeAssignmentFormData)
  }

  const changeCurrentPage = () => {
    setCloseWorkOrderFormPage(!CloseWorkOrderFormPage)
  }

  const onGetToSummary = (e) => {
    const properDate = convertToDateFormat(e)
    setCompletionDate(properDate)

    const operativeIds = Object.entries(e)
      .filter(([key]) => key.match(/^operativeId-\d+$/))
      .map(([, value]) => Number.parseInt(value))

    setSelectedOperatives(
      operativeIds.map((operativeId) =>
        availableOperatives.find((operative) => operative.id === operativeId)
      )
    )
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
                  operativeAssignmentMandatory={workOrder.canAssignOperative}
                  currentOperatives={selectedOperatives}
                  availableOperatives={availableOperatives}
                  dateRaised={workOrder.dateRaised}
                />
              )}
              {!CloseWorkOrderFormPage && (
                <SummaryCloseWorkOrder
                  onJobSubmit={onJobSubmit}
                  notes={notes}
                  time={completionTime}
                  date={dateToShow}
                  reason={reason}
                  operativeNames={
                    workOrder.canAssignOperative &&
                    selectedOperatives.map((operative) => operative.name)
                  }
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
