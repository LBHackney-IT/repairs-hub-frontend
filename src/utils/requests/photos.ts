import { frontEndApiRequest } from '../frontEndApiClient/requests'

export const fetchWorkOrderPhotosRequest = (workOrderReference: string) =>
  frontEndApiRequest({
    method: 'get',
    path: `/api/workOrders/images/${workOrderReference}`,
  })

export const updatePhotoFileGroupRequest = (requestData: object) =>
  frontEndApiRequest({
    method: 'patch',
    path: `/api/workOrders/images/fileGroup`,
    requestData,
  })

export const fetchPhotoUploadLinksRequest = (params: object) =>
  frontEndApiRequest({
    method: 'get',
    path: `/api/workOrders/images/uploadLink`,
    params,
  })

export const completePhotoUploadRequest = (requestData: object) =>
  frontEndApiRequest({
    method: 'post',
    path: `/api/workOrders/images/completeUpload`,
    requestData,
  })
