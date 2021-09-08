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
  const [operativesWithPercentages, setOperativesWithPercentages] = useState([])
  const [
    selectedPercentagesToShowOnEdit,
    setSelectedPercentagesToShowOnEdit,
  ] = useState([])

  const [CloseWorkOrderFormPage, setCloseWorkOrderFormPage] = useState(true)
  const router = useRouter()

  const OPERATIVE_ID_REGEX = /\[(\d+)\]$/

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

  const operativesAndPercentagesForNotes = (opsAndPercentages) => {
    return opsAndPercentages
      .map(
        (op) =>
          `${op.operative.name}${op.percentage ? ` : ${op.percentage}` : ''}`
      )
      .join(', ')
  }
  const onJobSubmit = async () => {
    const operativeAssignmentFormData = buildOperativeAssignmentFormData(
      reference,
      operativesWithPercentages
    )

    const fullNotes =
      operativesWithPercentages.length > 0
        ? [
            notes,
            `Assigned operatives ${operativesAndPercentagesForNotes(
              operativesWithPercentages
            )}`,
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

    const operativeIds = Object.keys(e)
      .filter((k) => k.match(/operative-\d+/))
      .map((operativeKey) => {
        const matches = e[operativeKey].match(OPERATIVE_ID_REGEX)

        if (Array.isArray(matches)) {
          return Number.parseInt(matches[matches.length - 1])
        }
      })

    const percentages = Object.entries(e)
      .filter(([key]) => key.match(/^percentage-\d+$/))
      .map(([, value]) => value)

    setSelectedOperatives(
      operativeIds.map((operativeId) =>
        availableOperatives.find((operative) => operative.id === operativeId)
      )
    )
    setSelectedPercentagesToShowOnEdit(percentages)
    setOperativesWithPercentages(
      operativeIds.map((operativeId, index) => {
        return {
          operative: availableOperatives.find(
            (operative) => operative.id === operativeId
          ),
          percentage: percentages[index],
        }
      })
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
                  assignedOperativesToWorkOrder={selectedOperatives}
                  availableOperatives={availableOperatives}
                  dateRaised={workOrder.dateRaised}
                  selectedPercentagesToShowOnEdit={
                    selectedPercentagesToShowOnEdit
                  }
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
                    operativesWithPercentages &&
                    operativesWithPercentages.map(
                      (op) =>
                        `${op.operative.name}${
                          op.percentage ? ` : ${op.percentage}` : ''
                        }`
                    )
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
