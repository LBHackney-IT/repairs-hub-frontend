import PropTypes from 'prop-types'
import CloseWorkOrderForm from './CloseWorkOrderForm'
import { useState, useEffect } from 'react'
import { convertToDateFormat } from '@/utils/date'
import SummaryCloseWorkOrder from './SummaryCloseWorkOrder'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import {
  buildCloseWorkOrderData,
  buildWorkOrderCompleteNotes,
} from '@/utils/hact/workOrderComplete/closeWorkOrder'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { buildOperativeAssignmentFormData } from '@/utils/hact/jobStatusUpdate/assignOperatives'
import { WorkOrder } from '@/models/workOrder'
import SuccessPage from '../SuccessPage/index'
import Panel from '@/components/Template/Panel'
import { generalLinks } from '@/utils/successPageLinks'

// Named this way because this component exists to allow supervisors
// to close work orders on behalf of (i.e. a proxy for) an operative.
//
// Typically this means a supervisor is copying information from
// another source to close this work order.

const CloseWorkOrderByProxy = ({ reference }) => {
  const [completionDate, setCompletionDate] = useState('')
  const [completionTime, setCompletionTime] = useState('')
  const [dateToShow, setDateToShow] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [notes, setNotes] = useState('')
  const [reason, setReason] = useState('')
  const [paymentType, setPaymentType] = useState(null)
  const [availableOperatives, setAvailableOperatives] = useState([])
  const [selectedOperatives, setSelectedOperatives] = useState([])
  const [workOrder, setWorkOrder] = useState()
  const [operativesWithPercentages, setOperativesWithPercentages] = useState([])
  const [selectedPercentagesToShowOnEdit, setSelectedPercentagesToShowOnEdit] =
    useState([])

  const FORM_PAGE = 1
  const SUMMARY_PAGE = 2
  const CONFIRMATION_PAGE = 3

  const [currentPage, setCurrentPage] = useState(FORM_PAGE)

  const OPERATIVE_ID_REGEX = /\[(\d+)\]$/

  const makePostRequest = async (
    workOrderCompleteFormData,
    operativeAssignmentFormData
  ) => {
    setLoading(true)

    try {
      if (workOrder.canAssignOperative) {
        await frontEndApiRequest({
          method: 'post',
          path: `/api/jobStatusUpdate`,
          requestData: operativeAssignmentFormData,
        })
      }

      await frontEndApiRequest({
        method: 'post',
        path: `/api/workOrderComplete`,
        requestData: workOrderCompleteFormData,
      })

      setCurrentPage(CONFIRMATION_PAGE)
      setLoading(false)
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
        workOrder.paymentType && setPaymentType(workOrder.paymentType)

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
    const operativeAssignmentFormData = buildOperativeAssignmentFormData(
      reference,
      operativesWithPercentages
    )

    let fullNotes = buildWorkOrderCompleteNotes(
      notes,
      operativesWithPercentages,
      paymentType
    )

    const closeWorkOrderFormData = buildCloseWorkOrderData(
      completionDate,
      fullNotes,
      reference,
      reason,
      paymentType
    )

    makePostRequest(closeWorkOrderFormData, operativeAssignmentFormData)
  }

  const changeCurrentPage = () => {
    setCurrentPage(FORM_PAGE)
  }

  const onGetToSummary = (formData) => {
    const properDate = convertToDateFormat(
      formData.date,
      formData.completionTime
    )
    setCompletionDate(properDate)

    const operativeIds = Object.keys(formData)
      .filter((k) => k.match(/operative-\d+/))
      .map((operativeKey) => {
        const matches = formData[operativeKey].match(OPERATIVE_ID_REGEX)

        if (Array.isArray(matches)) {
          return Number.parseInt(matches[matches.length - 1])
        }
      })

    const percentages = Object.entries(formData)
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
    setReason(formData.reason)
    setNotes(formData.notes)
    setDateToShow(formData.date)
    formData.paymentType && setPaymentType(formData.paymentType)
    setCurrentPage(SUMMARY_PAGE)
    setCompletionTime(formData.completionTime)
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
              {currentPage === FORM_PAGE && (
                <CloseWorkOrderForm
                  reference={workOrder.reference}
                  onSubmit={onGetToSummary}
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
                  closingByProxy={true}
                  totalSMV={workOrder.totalSMVs}
                  jobIsSplitByOperative={workOrder.isSplit}
                  paymentType={paymentType}
                />
              )}

              {currentPage === SUMMARY_PAGE && (
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
                  paymentType={paymentType}
                />
              )}
              {currentPage === CONFIRMATION_PAGE && (
                <SuccessPage
                  banner={
                    <Panel
                      title="Work order closed"
                      workOrderReference={workOrder.reference}
                    />
                  }
                  links={generalLinks(workOrder.reference)}
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

CloseWorkOrderByProxy.propTypes = {
  reference: PropTypes.string.isRequired,
}

export default CloseWorkOrderByProxy
