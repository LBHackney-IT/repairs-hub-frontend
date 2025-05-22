import * as HttpStatus from 'http-status-codes'
import { authoriseServiceAPIRequest } from '@/utils/serviceApiClient'

export default authoriseServiceAPIRequest(async (req, res) => {
  const data = {
    followOnFunctionalityEnabled:
      process.env.FOLLOW_ON_FUNCTIONALITY_ENABLED === 'true',

    pastWorkOrdersFunctionalityEnabled:
      process.env.PAST_WORK_ORDERS_ENABLED === 'true',

    googleTagManagerEnabled: !!process.env.TAG_MANAGER_ID,

    enableNewAppointmentEndpoint:
      process.env.NEW_APPOINTMENT_ENDPOINT_ENABLED === 'true',
  }

  res.status(HttpStatus.StatusCodes.OK).json(data)
})
