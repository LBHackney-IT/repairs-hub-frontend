import { frontEndApiRequest } from '../frontEndApiClient/requests'

export const postLogMessageRequest = (message: string) =>
  frontEndApiRequest({
    method: 'post',
    path: '/api/logging',
    requestData: { message },
    timeout: 5000, // Add timeout to prevent hanging requests
  })
