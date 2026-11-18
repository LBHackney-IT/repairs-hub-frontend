import { frontEndApiRequest } from '../frontEndApiClient/requests'

export const postCloseWithoutPhotoFeedbackRequest = (requestData: object) =>
  frontEndApiRequest({
    method: 'post',
    path: '/api/feedback/close-work-order-without-photo',
    requestData,
  })
