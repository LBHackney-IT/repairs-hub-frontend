import * as HttpStatus from 'http-status-codes'
import { authoriseServiceAPIRequest } from '@/utils/serviceApiClient'

export default authoriseServiceAPIRequest(async (req, res) => {
  const data = {
    followOnFunctionalityEnabled:
      process.env.FOLLOW_ON_FUNCTIONALITY_ENABLED === 'true',
  }

  res.status(HttpStatus.StatusCodes.OK).json(data)
})
