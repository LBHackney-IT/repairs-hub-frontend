import * as HttpStatus from 'http-status-codes'
import type { NextApiRequest, NextApiResponse } from 'next'

import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '@/utils/serviceApiClient'

// Catch-all endpoint. Assumes incoming requests have paths and params
// matching those on the service API endpoint so it can forward them
// without any additional knowledge.
export default authoriseServiceAPIRequest(
  async (req: NextApiRequest, res: NextApiResponse) => {
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
