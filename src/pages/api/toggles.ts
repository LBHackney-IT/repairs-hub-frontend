import * as HttpStatus from 'http-status-codes'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  configurationAPIRequest,
  authoriseServiceAPIRequest,
} from '@/utils/serviceApiClient'

export default authoriseServiceAPIRequest(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const data = await configurationAPIRequest(req)

      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      const errorToThrow: Error & { response?: unknown } = new Error(error)

      errorToThrow.response = error.response
      throw errorToThrow
    }
  }
)
