import CloseWorkOrderForm from './CloseWorkOrderForm'
import { useState, useEffect } from 'react'
import { convertToDateFormat } from '@/utils/date'
import SummaryCloseWorkOrder from './SummaryCloseWorkOrder'
import ErrorMessage from '../Errors/ErrorMessage'
import {
  buildCloseWorkOrderData,
  buildFollowOnRequestData,
} from '@/utils/hact/workOrderComplete/closeWorkOrder'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { buildOperativeAssignmentFormData } from '@/utils/hact/jobStatusUpdate/assignOperatives'
import { WorkOrder } from '@/models/workOrder'
import SuccessPage from '../SuccessPage/index'
import Panel from '@/components/Template/Panel'
import { generalLinks } from '@/utils/successPageLinks'
import { FOLLOW_ON_REQUEST_AVAILABLE_TRADES } from '../../utils/statusCodes'
import uploadFiles from '../WorkOrder/Photos/hooks/uploadFiles'
import { buildWorkOrderCompleteNotes } from '../../utils/hact/workOrderComplete/closeWorkOrder'
import SpinnerWithLabel from '../SpinnerWithLabel'
import {
  getAppointmentDetails,
  getWorkOrderDetails,
} from '../../utils/requests/workOrders'
import { APIResponseError } from '../../types/requests/types'
import { formatRequestErrorMessage } from '../../utils/errorHandling/formatErrorMessage'
import { Operative } from '../../models/operativeModel'
import { clearIndexedDb } from '../WorkOrder/Photos/hooks/uploadFiles/cacheFile'

// Named this way because this component exists to allow supervisors
// to close work orders on behalf of (i.e. a proxy for) an operative.
//
// Typically this means a supervisor is copying information from
// another source to close this work order.

interface Props {
  reference: string
}

const CloseWorkOrderByProxy = ({ reference }: Props) => {
  const [completionDate, setCompletionDate] = useState('')
  const [completionTime, setCompletionTime] = useState('')

  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [files, setFiles] = useState([])
  const [description, setDescription] = useState<string>('')

  const [loadingStatus, setLoadingStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>()
  const [notes, setNotes] = useState('')
  const [reason, setReason] = useState('')
  const [followOnStatus, setFollowOnStatus] = useState('')
  const [paymentType, setPaymentType] = useState(null)
  const [availableOperatives, setAvailableOperatives] = useState<Operative[]>(
    []
  )
  const [selectedOperatives, setSelectedOperatives] = useState<Operative[]>([])
  const [workOrder, setWorkOrder] = useState<WorkOrder>()
  const [operativesWithPercentages, setOperativesWithPercentages] = useState([])
  const [selectedPercentagesToShowOnEdit, setSelectedPercentagesToShowOnEdit] =
    useState([])

  const [followOnData, setFollowOnData] = useState(null)

  const FORM_PAGE = 1
  const SUMMARY_PAGE = 2
  const CONFIRMATION_PAGE = 3

  const [currentPage, setCurrentPage] = useState<number>(FORM_PAGE)

  const OPERATIVE_ID_REGEX = /\[(\d+)\]$/

  const makePostRequest = async (
    workOrderCompleteFormData,
    operativeAssignmentFormData
  ) => {
    setLoadingStatus('Completing workorder')

    try {
      if (files.length > 0) {
        const uploadResult = await uploadFiles(
          files,
          reference,
          description,
          'Closing work order',
          setLoadingStatus
        )

        if (!uploadResult.success) {
          setError(uploadResult.requestError)
          setLoadingStatus(null)
          return
        }

        setLoadingStatus('Completing workorder')
      }

      if (workOrder.canAssignOperative) {
        await frontEndApiRequest({
          method: 'post',
          path: `/api/jobStatusUpdate`,
          requestData: operativeAssignmentFormData,
        })
      }

      if (startDate !== '') {
        await frontEndApiRequest({
          method: 'put',
          path: `/api/workOrders/starttime`,
          requestData: {
            startTime: startDate,
            workOrderId: reference,
          },
        })
      }

      await frontEndApiRequest({
        method: 'post',
        path: `/api/workOrderComplete`,
        requestData: workOrderCompleteFormData,
      })

      setCurrentPage(CONFIRMATION_PAGE)
      setLoadingStatus(null)
    } catch (e) {
      console.error(e)
      setError(formatRequestErrorMessage(e))
      setLoadingStatus(null)
    }
  }

  const fetchInitialData = async () => {
    setError(null)

    try {
      const workOrderResponse = await getWorkOrderDetails(reference)
      if (!workOrderResponse.success) throw workOrderResponse.error
      const workOrder = workOrderResponse.response
      setWorkOrder(new WorkOrder(workOrder))

      const appointmentDetailsResponse = await getAppointmentDetails(reference)
      if (!appointmentDetailsResponse.success)
        throw appointmentDetailsResponse.error
      const appointmentDetails = appointmentDetailsResponse.response
      // setAppointmentDetails(new WorkOrderAppointmentDetails(appointmentDetails))

      if (workOrder.canAssignOperative) {
        workOrder.paymentType && setPaymentType(workOrder.paymentType)

        setSelectedOperatives(appointmentDetails.operatives)

        const operatives = await frontEndApiRequest({
          method: 'get',
          path: `/api/operatives`,
        })
        setAvailableOperatives(operatives)
      }
    } catch (e) {
      setWorkOrder(null)
      // setAppointmentDetails(null)
      setAvailableOperatives([])

      console.error('An error has occured:', e.response)

      if (e instanceof APIResponseError) {
        setError(e.message)
      } else {
        setError(formatRequestErrorMessage(e))
      }
    }
    setLoadingStatus(null)
  }

  useEffect(() => {
    setLoadingStatus('Loading workorder')

    fetchInitialData()
  }, [])

  const onJobSubmit = async () => {
    const operativeAssignmentFormData = buildOperativeAssignmentFormData(
      reference,
      operativesWithPercentages
    )

    let followOnDataRequest = null

    if (followOnData !== null) {
      const requiredFollowOnTrades = []

      if (followOnData.requiredFollowOnTrades) {
        requiredFollowOnTrades.push(
          ...followOnData.requiredFollowOnTrades.map((x) => x.value)
        )
      }

      followOnDataRequest = buildFollowOnRequestData(
        followOnData.isEmergency,
        followOnData.isMultipleOperatives,
        requiredFollowOnTrades,
        followOnData.followOnTypeDescription,
        followOnData.stockItemsRequired,
        followOnData.nonStockItemsRequired,
        followOnData.materialNotes,
        followOnData.additionalNotes,
        followOnData.supervisorCalled,
        followOnData.otherTrade
      )
    }

    let comments = notes // notes written by user

    if (reason == 'No Access') {
      comments = `Work order closed - ${buildWorkOrderCompleteNotes(
        notes,
        operativesWithPercentages,
        paymentType
      )}`
    }

    const closeWorkOrderFormData = buildCloseWorkOrderData(
      new Date(completionDate),
      comments,
      reference,
      reason,
      paymentType,
      followOnDataRequest
    )

    await makePostRequest(closeWorkOrderFormData, operativeAssignmentFormData)
    await clearIndexedDb()
  }

  const changeCurrentPage = () => {
    setCurrentPage(FORM_PAGE)
  }

  const onGetToSummary = (formData, files) => {
    const formattedCompletionDate = convertToDateFormat(
      formData.completionDate,
      formData.completionTime
    )
    setCompletionDate(formattedCompletionDate)

    setFiles(files)
    setDescription(formData.description)

    // set follow on data

    if (formData.followOnStatus === 'furtherWorkRequired') {
      const requiredFollowOnTrades = []

      FOLLOW_ON_REQUEST_AVAILABLE_TRADES.forEach((x) => {
        if (formData[x.name]) requiredFollowOnTrades.push(x)
      })

      const followOnData = {
        isEmergency: formData.isEmergency === 'true',
        isMultipleOperatives: formData.isMultipleOperatives === 'true',
        requiredFollowOnTrades: requiredFollowOnTrades,
        followOnTypeDescription: formData.followOnTypeDescription,
        stockItemsRequired: formData.stockItemsRequired,
        nonStockItemsRequired: formData.nonStockItemsRequired,
        materialNotes: formData.materialNotes,
        additionalNotes: formData.additionalNotes,
        supervisorCalled: formData.supervisorCalled === 'Yes',
        otherTrade: formData.otherTrade,
      }

      setFollowOnData(followOnData)
    }

    if (
      !Object.prototype.hasOwnProperty.call(formData, 'startDate') ||
      formData.startDate === ''
    ) {
      setStartDate('')
    } else {
      const formattedStartDate = convertToDateFormat(
        formData.startDate,
        formData.startTime
      )

      setStartDate(formattedStartDate)
    }

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
    setFollowOnStatus(formData.followOnStatus)
    setNotes(formData.notes)
    // setDateToShow(formData.completionDate)
    formData.paymentType && setPaymentType(formData.paymentType)
    setCurrentPage(SUMMARY_PAGE)
    setCompletionTime(formData.completionTime)
    setStartTime(formData.startTime)
  }

  if (loadingStatus) return <SpinnerWithLabel label={loadingStatus} />

  return (
    <>
      {!workOrder && error && <ErrorMessage label={error} />}

      {workOrder && (
        <>
          {currentPage === FORM_PAGE && (
            <CloseWorkOrderForm
              reference={workOrder.reference}
              onSubmit={onGetToSummary}
              notes={notes}
              completionTime={completionTime}
              completionDate={completionDate}
              startTime={startTime}
              startDate={startDate}
              reason={reason}
              followOnStatus={followOnStatus}
              operativeAssignmentMandatory={workOrder.canAssignOperative}
              assignedOperativesToWorkOrder={selectedOperatives}
              availableOperatives={availableOperatives}
              dateRaised={workOrder.dateRaised}
              selectedPercentagesToShowOnEdit={selectedPercentagesToShowOnEdit}
              defaultFiles={files}
              description={description}
              totalSMV={workOrder.totalSMVs}
              jobIsSplitByOperative={workOrder.isSplit}
              paymentType={paymentType}
              existingStartTime={workOrder.startTime !== null}
              followOnData={followOnData}
              isLoading={loadingStatus !== null}
            />
          )}

          {currentPage === SUMMARY_PAGE && (
            <SummaryCloseWorkOrder
              onJobSubmit={onJobSubmit}
              notes={notes}
              completionDate={completionDate}
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
              startDate={startDate}
              followOnData={followOnData}
              files={files}
              description={description}
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
  )
}

export default CloseWorkOrderByProxy
