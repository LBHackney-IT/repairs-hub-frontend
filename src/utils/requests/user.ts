import { frontEndApiRequest } from '../frontEndApiClient/requests'
import { CurrentUser } from '../../types/variations/types'
import { FIVE_MINUTES, queryClient } from '../queryClient'

export const hubUserQuery = () => ({
  queryKey: ['hubUser'],
  queryFn: () =>
    frontEndApiRequest<CurrentUser>({
      method: 'get',
      path: '/api/hub-user',
    }),
  staleTime: FIVE_MINUTES,
})

export const fetchHubUserRequest = () => queryClient.fetchQuery(hubUserQuery())
