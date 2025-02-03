import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { WorkOrder } from '@/models/workOrder'

const DLO_REFERENCE_REGEX = /^H\d{2,}$/

export const isDLOContractorReference = (contractorReference) =>
  contractorReference && contractorReference.match(DLO_REFERENCE_REGEX)

export const isContractorScheduledInternally = isDLOContractorReference

export const getWorkOrder = async (workOrderReference: string) => {
  try {
    const workOrderData = await frontEndApiRequest({
      method: 'get',
      path: `/api/workOrders/${workOrderReference}`,
    })

    return {
      workOrder: new WorkOrder(workOrderData),
      error: null,
    }
  } catch (e) {
    console.error('An error has occurred:', e.response)

    return {
      workOrder: null,
      error:
        e.response?.status === 404
          ? `Could not find a work order with reference ${workOrderReference}`
          : `Oops, an error occurred: ${
              e.response?.status
            } with message: ${JSON.stringify(e.response?.data?.message)}`,
    }
  }
}
