import * as HttpStatus from 'http-status-codes'
import { authoriseServiceAPIRequest } from '@/utils/serviceApiClient'

export interface SimpleFeatureToggleResponse {
  googleTagManagerEnabled: boolean
  enableNewAppointmentEndpoint: boolean
}

export default authoriseServiceAPIRequest(async (req, res) => {
  const data: SimpleFeatureToggleResponse = {
    googleTagManagerEnabled: !!process.env.TAG_MANAGER_ID,

    enableNewAppointmentEndpoint:
      process.env.NEW_APPOINTMENT_ENDPOINT_ENABLED === 'true',
  }

  res.status(HttpStatus.StatusCodes.OK).json(data)
})
