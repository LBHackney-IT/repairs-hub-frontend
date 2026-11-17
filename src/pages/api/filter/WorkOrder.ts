import * as HttpStatus from 'http-status-codes'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '@/utils/serviceApiClient'

const FOUR_HOURS_IN_SECONDS = 4 * 60 * 60

// The work order filter options change very rarely, so the browser can reuse
// the response (including across page reloads)
export default authoriseServiceAPIRequest(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')

      return res
        .status(HttpStatus.METHOD_NOT_ALLOWED)
        .json({ message: 'Method not allowed' })
    }

    req.query = { path: ['filter', 'WorkOrder'] }

    try {
      const data = await serviceAPIRequest(req)

      // `private` as the options depend on the signed in user, and
      // `Vary: Cookie` stops them being reused if someone else signs in
      res.setHeader(
        'Cache-Control',
        `private, max-age=${FOUR_HOURS_IN_SECONDS}`
      )
      res.setHeader('Vary', 'Cookie')

      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      const errorToThrow: Error & { response?: unknown } = new Error(error)

      errorToThrow.response = error.response
      throw errorToThrow
    }
  }
)
