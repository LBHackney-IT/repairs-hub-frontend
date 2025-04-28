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

    relatedWorkOrdersTabEnabled:
      process.env.RELATED_WORKORDRES_TAB_ENABLED === 'true',
  }

  res.status(HttpStatus.StatusCodes.OK).json(data)
})
