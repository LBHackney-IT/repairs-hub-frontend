import * as HttpStatus from 'http-status-codes'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  authoriseServiceAPIRequest,
  serviceAPIRequest,
} from '@/utils/serviceApiClient'

export default authoriseServiceAPIRequest(
  async (req: NextApiRequest, res: NextApiResponse) => {
    req.query = { path: ['properties', 'guid-pk', req.query.id as string] }

    try {
      const data = await serviceAPIRequest(req)

      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      const errorToThrow: Error & { response?: unknown } = new Error(error)

      errorToThrow.response = error.response
      throw errorToThrow
    }
  }
)
