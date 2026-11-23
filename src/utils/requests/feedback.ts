import { frontEndApiRequest } from '../frontEndApiClient/requests'

export interface CloseWithoutPhotoFeedbackData {
  uploadWasTakingTooLong: boolean
  uploadFailed: boolean
  photosWereNotNecessary: boolean
  comments: string
  workOrderId: string
}

export const postCloseWithoutPhotoFeedbackRequest = (
  requestData: CloseWithoutPhotoFeedbackData
) =>
  frontEndApiRequest({
    method: 'post',
    path: '/api/feedback/close-work-order-without-photo',
    requestData,
  })
