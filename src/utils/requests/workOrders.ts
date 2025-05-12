import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { WorkOrder } from '@/models/workOrder'
import { APIResponseError, ApiResponseType } from '../../types/requests/types'
import { NoteDataType } from '../../types/requests/types'

export const getWorkOrder = async (
  workOrderReference: string
): Promise<ApiResponseType<WorkOrder | null>> => {
  try {
    const workOrderData = await frontEndApiRequest({
      method: 'get',
      path: `/api/workOrders/${workOrderReference}`,
    })

    return {
      success: true,
      response: new WorkOrder(workOrderData),
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
          : `Oops, an error occurred: ${
              e.response?.status
            } with message: ${JSON.stringify(e.response?.data?.message)}`
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
          : `Oops, an error occurred: ${
              e.response?.status
            } with message: ${JSON.stringify(e.response?.data?.message)}`
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
          : `Oops, an error occurred: ${
              e.response?.status
            } with message: ${JSON.stringify(e.response?.data?.message)}`
      ),
    }
  }
}
