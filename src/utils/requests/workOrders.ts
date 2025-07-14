import {
  fetchSimpleFeatureToggles,
  frontEndApiRequest,
} from '@/utils/frontEndApiClient/requests'
import { WorkOrder } from '@/models/workOrder'
import { APIResponseError, ApiResponseType } from '../../types/requests/types'
import { NoteDataType } from '../../types/requests/types'
import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'
import { formatRequestErrorMessage } from '../errorHandling/formatErrorMessage'

export const getWorkOrderOld = async (
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
          : formatRequestErrorMessage(e)
      ),
    }
  }
}

export const getWorkOrder = async (
  workOrderReference: string,
  includeAppointmentData: boolean
): Promise<ApiResponseType<WorkOrder | null>> => {
  try {
    const featureToggleData = await fetchSimpleFeatureToggles()

    if (!featureToggleData?.enableNewAppointmentEndpoint) {
      // default to old endpoint if FT disabled
      return await getWorkOrderOld(workOrderReference)
    }

    const workOrderData = await frontEndApiRequest({
      method: 'get',
      path: `/api/workOrders/${workOrderReference}/new`,
    })

    const workOrder = new WorkOrder(workOrderData)

    if (includeAppointmentData) {
      const appointmentOperativeData: WorkOrderAppointmentDetails = await frontEndApiRequest(
        {
          method: 'get',
          path: `/api/workOrders/appointments/${workOrderReference}`,
        }
      )

      // map appointment/operative data from new endpoint
      workOrder.appointment = appointmentOperativeData.appointment
      workOrder.operatives = appointmentOperativeData.operatives
      workOrder.externalAppointmentManagementUrl =
        appointmentOperativeData.externalAppointmentManagementUrl
      workOrder.plannerComments = appointmentOperativeData.plannerComments
    }

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
