import { frontEndApiRequest } from '../frontEndApiClient/requests'

export const postJobStatusUpdateRequest = (requestData: object) =>
  frontEndApiRequest({
    method: 'post',
    path: `/api/jobStatusUpdate`,
    requestData,
  })
