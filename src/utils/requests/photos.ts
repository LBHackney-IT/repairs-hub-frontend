import { frontEndApiRequest } from '../frontEndApiClient/requests'

export interface PhotoUploadLinksParams {
  workOrderReference: string
  numberOfFiles: number
}

export interface CompletePhotoUploadData {
  workOrderReference: string
  s3Objects: string[]
  description: string
  uploadGroupLabel: string
}

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

export const fetchPhotoUploadLinksRequest = (params: PhotoUploadLinksParams) =>
  frontEndApiRequest({
    method: 'get',
    path: `/api/workOrders/images/uploadLink`,
    params,
  })

export const completePhotoUploadRequest = (
  requestData: CompletePhotoUploadData
) =>
  frontEndApiRequest({
    method: 'post',
    path: `/api/workOrders/images/completeUpload`,
    requestData,
  })
