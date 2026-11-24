import { frontEndApiRequest } from '../frontEndApiClient/requests'
import { SimpleFeatureToggleResponse } from '../../pages/api/simple-feature-toggle'

export const fetchSimpleFeatureTogglesRequest: () => Promise<SimpleFeatureToggleResponse> = async () => {
  const featureToggleData = await frontEndApiRequest({
    method: 'get',
    path: '/api/simple-feature-toggle',
  })

  return featureToggleData
}
