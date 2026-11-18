import { frontEndApiRequest } from '../frontEndApiClient/requests'

export const fetchHubUserRequest = () =>
  frontEndApiRequest({
    method: 'get',
    path: '/api/hub-user',
  })
