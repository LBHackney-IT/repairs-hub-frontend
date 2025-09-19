import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { WorkOrder } from '@/models/workOrder'
import { APIResponseError, ApiResponseType } from '../../types/requests/types'
import { NoteDataType } from '../../types/requests/types'
import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'
import { formatRequestErrorMessage } from '../errorHandling/formatErrorMessage'
import { WorkOrderTasks } from '../../models/workOrderTasks'

export const getAppointmentDetails = async (
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

export const getWorkOrderDetails = async (
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

export const editWorkOrder = async (
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

export const getWorkOrderTasks = async (
  workOrderReference: string
): Promise<ApiResponseType<WorkOrderTasks[]>> => {
  try {
    const tasksResponse: WorkOrderTasks[] = await frontEndApiRequest({
      method: 'get',
      path: `/api/workOrders/${workOrderReference}/tasks`,
    })

    return {
      success: true,
      response: tasksResponse,
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

export const postNote = async (
  noteData: NoteDataType
): Promise<ApiResponseType<null>> => {
  try {
    await frontEndApiRequest({
      method: 'post',
      path: `/api/jobStatusUpdate`,
      requestData: noteData,
    })

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
