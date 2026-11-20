import { frontEndApiRequest } from '../frontEndApiClient/requests'
import { CurrentUser } from '../../types/variations/types'

export const fetchHubUserRequest = () =>
  frontEndApiRequest<CurrentUser>({
    method: 'get',
    path: '/api/hub-user',
  })
