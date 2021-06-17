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
import { postJobStatusUpdate } from '../../utils/frontend-api-client/job-status-update'
import { getOperatives } from '../../utils/frontend-api-client/operatives'
import { isDLOContractorReference } from '../../utils/helpers/work-orders'
import { buildOperativeAssignmentFormData } from '../../utils/hact/job-status-update/assign-operatives'

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
      if (isDLOContractorReference(workOrder.contractorReference)) {
        postJobStatusUpdate(operativeAssignmentFormData).then(() => {
          postWorkOrderComplete(workOrderCompleteFormData)
        })
      } else {
        postWorkOrderComplete(workOrderCompleteFormData)
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
      const workOrder = await getWorkOrder(reference)
      setWorkOrder(workOrder)

      if (isDLOContractorReference(workOrder.contractorReference)) {
        setSelectedOperatives(workOrder.operatives)

        const operatives = await getOperatives()
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
    const CloseWorkOrderFormData = buildCloseWorkOrderData(
      completionDate,
      notes,
      reference,
      reason
    )

    const operativeAssignmentFormData = buildOperativeAssignmentFormData(
      reference,
      selectedOperatives
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
                  operativeAssignmentMandatory={isDLOContractorReference(
                    workOrder.contractorReference
                  )}
                  currentOperatives={selectedOperatives}
                  availableOperatives={availableOperatives}
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
                    isDLOContractorReference(workOrder.contractorReference) &&
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
