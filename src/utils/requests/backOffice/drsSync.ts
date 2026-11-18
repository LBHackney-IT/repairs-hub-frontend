import { frontEndApiRequest } from '../../frontEndApiClient/requests'

export interface DrsSyncOrderData {
  workOrderId: string | number
}

export const fetchWorkOrdersBySyncStatusRequest = () =>
  frontEndApiRequest({
    method: 'get',
    path: '/api/backoffice/work-orders-by-sync-status',
  })

export const resendOrderRequest = (requestData: DrsSyncOrderData) =>
  frontEndApiRequest({
    method: 'post',
    path: '/api/backoffice/resend-order',
    requestData,
  })

export const resetSyncStatusRequest = (requestData: DrsSyncOrderData) =>
  frontEndApiRequest({
    method: 'post',
    path: '/api/backoffice/reset-sync-status',
    requestData,
  })
