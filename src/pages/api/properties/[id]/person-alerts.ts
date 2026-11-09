import * as HttpStatus from 'http-status-codes'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '@/utils/serviceApiClient'

export default authoriseServiceAPIRequest(
  async (req: NextApiRequest, res: NextApiResponse) => {
    req.query = {
      path: ['properties', req.query.id as string, 'person-alerts'],
    }

    try {
      const data = await serviceAPIRequest(req)

      res.status(HttpStatus.StatusCodes.OK).json(data)
    } catch (error) {
      const errorToThrow: Error & { response?: unknown } = new Error(error)

      errorToThrow.response = error.response
      throw errorToThrow
    }
  }
)
