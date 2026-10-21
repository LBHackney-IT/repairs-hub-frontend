import * as HttpStatus from 'http-status-codes'
import { authoriseServiceAPIRequest } from '@/utils/serviceApiClient'

export interface SimpleFeatureToggleResponse {
  googleTagManagerEnabled: boolean
  enableFollowOnIsEmergencyField: boolean
  enableNewAwaabsFields: boolean
  enableHealthAndSafetyFlag: boolean
  enableMultipleSorsEditor: boolean
}

export default authoriseServiceAPIRequest(async (req, res) => {
  const data: SimpleFeatureToggleResponse = {
    googleTagManagerEnabled: !!process.env.TAG_MANAGER_ID,

    enableFollowOnIsEmergencyField:
      process.env.FOLLOW_ON_IS_EMERGENCY_FIELD_ENABLED === 'true',

    enableNewAwaabsFields: process.env.ENABLE_NEW_AWAABS_FIELDS === 'true',

    enableHealthAndSafetyFlag:
      process.env.ENABLE_HEALTH_AND_SAFETY_FLAG === 'true',

    // Hard coded on for now: validated editor with optional quantities on the
    // raise work order "Add multiple SOR codes" page
    enableMultipleSorsEditor: true,
  }

  res.status(HttpStatus.StatusCodes.OK).json(data)
})
