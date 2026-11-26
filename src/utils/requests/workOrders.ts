import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { WorkOrder } from '@/models/workOrder'
import { APIResponseError, ApiResponseType } from '../../types/requests/types'
import { NoteDataType } from '../../types/requests/types'
import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'
import { formatRequestErrorMessage } from '../errorHandling/formatErrorMessage'
import { WorkOrderTasks } from '../../models/workOrderTasks'
import { buildApproveCompletionFormData } from '../hact/jobStatusUpdate/approveCompletion'
import { postJobStatusUpdateRequest } from './jobStatusUpdate'
import { BudgetCode } from '../../models/budgetCode'
import { WorkOrderHierarchy } from '../../models/workOrderHierarchy'
import { VariationResponseObject } from '../../types/variations/types'
import { closeWorkOrderDataRequest } from '../hact/workOrderComplete/closeWorkOrder'
import { FIVE_MINUTES, queryClient } from '../queryClient'
import { buildCancelWorkOrderFormData } from '../hact/workOrderComplete/cancelWorkOrderForm'
import { buildScheduleWorkOrderFormData } from '../hact/workOrderSchedule/raiseWorkOrderForm'

export const getAppointmentDetailsRequest = async (
  workOrderReference: string
): Promise<ApiResponseType<WorkOrderAppointmentDetails | null>> => {
  try {
    const appointmentDetailsData = await frontEndApiRequest({
      method: 'get',
      path: `/api/workOrders/appointments/${workOrderReference}`,
    })

    const appointmentDetails = new WorkOrderAppointmentDetails(
      appointmentDetailsData
    )

    return {
      success: true,
      response: appointmentDetails,
      error: null,
    }
  } catch (e) {
    console.error('An error has occurred:', e.response)

    return {
      success: false,
      response: null,
      error: new APIResponseError(
        e.response?.status === 404
          ? `Failed to fetch appointment details for work order with reference ${workOrderReference}`
          : formatRequestErrorMessage(e)
      ),
    }
  }
}

export const getWorkOrderDetailsRequest = async (
  workOrderReference: string
): Promise<ApiResponseType<WorkOrder | null>> => {
  try {
    const workOrderData = await frontEndApiRequest({
      method: 'get',
      path: `/api/workOrders/${workOrderReference}`,
    })

    const workOrder = new WorkOrder(workOrderData)

    return {
      success: true,
      response: workOrder,
      error: null,
    }
  } catch (e) {
    console.error('An error has occurred:', e.response)

    return {
      success: false,
      response: null,
      error: new APIResponseError(
        e.response?.status === 404
          ? `Could not find a work order with reference ${workOrderReference}`
          : formatRequestErrorMessage(e)
      ),
    }
  }
}

export const editWorkOrderRequest = async (
  id: string,
  description: string,
  callerName: string,
  callerNumber: string
): Promise<ApiResponseType<null>> => {
  try {
    await frontEndApiRequest({
      method: 'patch',
      path: `/api/workOrders/editWorkOrder`,
      requestData: {
        workOrderId: id,
        description: description,
        callerName: callerName,
        callerNumber: callerNumber,
      },
    })

    return {
      success: true,
      response: null,
      error: null,
    }
  } catch (e: any) {
    console.error('An error has occurred:', e)

    return {
      success: false,
      response: null,
      error: new APIResponseError(
        e.response?.status === 400
          ? 'Invalid request data'
          : formatRequestErrorMessage(e)
      ),
    }
  }
}

export const approveWorkOrderCompletionRequest = async (
  workOrderReference: string,
  note?: string
): Promise<ApiResponseType<null>> => {
  try {
    await frontEndApiRequest({
      method: 'post',
      path: `/api/jobStatusUpdate`,
      requestData: buildApproveCompletionFormData(workOrderReference, note),
    })

    return {
      success: true,
      response: null,
      error: null,
    }
  } catch (e: any) {
    console.error('An error has occurred:', e)

    return {
      success: false,
      response: null,
      error: new APIResponseError(formatRequestErrorMessage(e)),
    }
  }
}

export const getWorkOrderTasksRequest = async (
  workOrderReference: string
): Promise<ApiResponseType<WorkOrderTasks[]>> => {
  try {
    const tasksResponse: WorkOrderTasks[] = await fetchWorkOrderTasksRequest(
      workOrderReference
    )

    return {
      success: true,
      response: tasksResponse,
      error: null,
    }
  } catch (e: any) {
    console.error('An error has occurred:', e.response)

    return {
      success: false,
      response: null,
      error: new APIResponseError(
        e.response?.status === 400
          ? 'Invalid request data'
          : formatRequestErrorMessage(e)
      ),
    }
  }
}

export const postNoteRequest = async (
  noteData: NoteDataType
): Promise<ApiResponseType<null>> => {
  try {
    await postJobStatusUpdateRequest(noteData)

    return {
      success: true,
      response: null,
      error: null,
    }
  } catch (e) {
    console.error('An error has occurred:', e)

    return {
      success: false,
      response: null,
      error: new APIResponseError(
        e.response?.status === 400
          ? `Invalid request data`
          : formatRequestErrorMessage(e)
      ),
    }
  }
}

export const fetchWorkOrderTasksRequest = (workOrderReference: string) =>
  frontEndApiRequest<WorkOrderTasks[]>({
    method: 'get',
    path: `/api/workOrders/${workOrderReference}/tasks`,
  })

export interface WorkOrdersParams {
  propertyReference?: string
  PageSize?: number
  PageNumber?: number
  sort?: string
  TradeCodes?: string
  IncludeFollowOns?: boolean
  // Filter keys built by buildWorkOrdersParams
  [filter: string]: unknown
}

export const fetchWorkOrdersRequest = (
  params: WorkOrdersParams,
  paramsSerializer?: any
) =>
  frontEndApiRequest({
    method: 'get',
    path: '/api/workOrders/',
    params,
    ...(paramsSerializer && { paramsSerializer }),
  })

export interface ScheduleWorkOrderParams {
  parentWorkOrderId?: string
}

export const scheduleWorkOrderRequest = (
  requestData: ReturnType<typeof buildScheduleWorkOrderFormData>,
  params?: ScheduleWorkOrderParams
) =>
  frontEndApiRequest({
    method: 'post',
    path: `/api/workOrders/schedule`,
    requestData,
    params,
  })

export interface BudgetCodesParams {
  contractorReference?: string
}

export const budgetCodesQuery = (params: BudgetCodesParams) => ({
  queryKey: ['budgetCodes', params],
  queryFn: () =>
    frontEndApiRequest<BudgetCode[]>({
      method: 'get',
      path: '/api/workOrders/budget-codes',
      params,
    }),
  staleTime: FIVE_MINUTES,
})

export const fetchBudgetCodesRequest = (params: BudgetCodesParams) =>
  queryClient.fetchQuery(budgetCodesQuery(params))

export interface StartWorkOrderData {
  startTime: Date | string
  workOrderId: string
}

export const startWorkOrderRequest = (requestData: StartWorkOrderData) =>
  frontEndApiRequest({
    method: 'put',
    path: `/api/workOrders/starttime`,
    requestData,
  })

export const completeWorkOrderRequest = (
  requestData:
    | closeWorkOrderDataRequest
    | ReturnType<typeof buildCancelWorkOrderFormData>
) =>
  frontEndApiRequest({
    method: 'post',
    path: `/api/workOrderComplete`,
    requestData,
  })

export const fetchWorkOrderNotesRequest = (workOrderReference: string) =>
  frontEndApiRequest({
    method: 'get',
    path: `/api/workOrders/${workOrderReference}/notes`,
  })

export const fetchWorkOrderHierarchyRequest = (workOrderReference: string) =>
  frontEndApiRequest<WorkOrderHierarchy>({
    path: `/api/workOrders/${workOrderReference}/hierarchy`,
    method: 'get',
  })

export const fetchWorkOrderVariationTasksRequest = (
  workOrderReference: string
) =>
  frontEndApiRequest<VariationResponseObject>({
    method: 'get',
    path: `/api/workOrders/${workOrderReference}/variation-tasks`,
  })
