import { frontEndApiRequest } from '../../frontEndApiClient/requests'

export interface BulkCloseData {
  reason: string
  completionDate: string
  workOrderReferences: string[]
}

export const bulkCloseWorkOrdersRequest = (
  closeToBase: boolean,
  requestData: BulkCloseData
) =>
  frontEndApiRequest({
    method: 'post',
    path: `/api/backOffice/bulk-close/${
      closeToBase ? 'close-to-base' : 'cancel'
    }`,
    requestData,
  })
