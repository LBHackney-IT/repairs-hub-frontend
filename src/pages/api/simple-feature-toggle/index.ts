import * as HttpStatus from 'http-status-codes'
import { authoriseServiceAPIRequest } from '@/utils/serviceApiClient'

export interface SimpleFeatureToggleResponse {
  googleTagManagerEnabled: boolean
  enableFollowOnIsEmergencyField: boolean
  enableRepairsFinderIntegration: boolean
}

export default authoriseServiceAPIRequest(async (req, res) => {
  const data: SimpleFeatureToggleResponse = {
    googleTagManagerEnabled: !!process.env.TAG_MANAGER_ID,

    enableFollowOnIsEmergencyField:
      process.env.FOLLOW_ON_IS_EMERGENCY_FIELD_ENABLED === 'true',

    enableRepairsFinderIntegration:
      process.env.REPAIRS_FINDER_INTEGRATION_ENABLED === 'true',
  }

  res.status(HttpStatus.StatusCodes.OK).json(data)
})
