import { frontEndApiRequest } from '../frontEndApiClient/requests'
import { SimpleFeatureToggleResponse } from '../../pages/api/simple-feature-toggle'
import { ONE_MINUTE, queryClient } from '../queryClient'

export const simpleFeatureTogglesQuery = () => ({
  queryKey: ['simpleFeatureToggles'],
  queryFn: () =>
    frontEndApiRequest<SimpleFeatureToggleResponse>({
      method: 'get',
      path: '/api/simple-feature-toggle',
    }),
  staleTime: ONE_MINUTE,
})

export const fetchSimpleFeatureTogglesRequest: () => Promise<SimpleFeatureToggleResponse> = () =>
  queryClient.fetchQuery(simpleFeatureTogglesQuery())
