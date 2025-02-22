import * as HttpStatus from 'http-status-codes'
import { authoriseServiceAPIRequest } from '@/utils/serviceApiClient'

export default authoriseServiceAPIRequest(async (req, res) => {
  const data = {
    followOnFunctionalityEnabled:
      process.env.FOLLOW_ON_FUNCTIONALITY_ENABLED === 'true',

    pastWorkOrdersFunctionalityEnabled:
      process.env.PAST_WORK_ORDERS_ENABLED === 'true',

    fetchAppointmentsFromDrs:
      process.env.FETCH_APPOINTMENTS_FROM_DRS === 'true',
  }

  res.status(HttpStatus.StatusCodes.OK).json(data)
})
