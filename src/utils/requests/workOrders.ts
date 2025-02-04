import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { WorkOrder } from '@/models/workOrder'
import { ApiResponseType } from '../../types/variations/types'
import { NoteData } from '../../types/edit-workorder/types'

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
      error:
        e.response?.status === 404
          ? `Could not find a work order with reference ${workOrderReference}`
          : `Oops, an error occurred: ${
              e.response?.status
            } with message: ${JSON.stringify(e.response?.data?.message)}`,
    }
  }
}

export const editDescription = async (
  id: string,
  description: string
): Promise<ApiResponseType<null>> => {
  try {
    await frontEndApiRequest({
      method: 'patch',
      path: `/api/workOrders/updateDescription`,
      requestData: {
        workOrderId: id,
        description: description,
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
      error:
        e.response?.status === 400
          ? 'Invalid request data'
          : `Oops, an error occurred: ${
              e.response?.status
            } with message: ${JSON.stringify(e.response?.data?.message)}`,
    }
  }
}

export const postNote = async (
  noteData: NoteData
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
      error:
        e.response?.status === 400
          ? `Invalid request data`
          : `Oops, an error occurred: ${
              e.response?.status
            } with message: ${JSON.stringify(e.response?.data?.message)}`,
    }
  }
}
