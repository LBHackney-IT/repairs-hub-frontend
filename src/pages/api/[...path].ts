import * as HttpStatus from 'http-status-codes'
import type { NextApiRequest, NextApiResponse } from 'next'

import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '@/utils/serviceApiClient'

const FOUR_HOURS_IN_SECONDS = 4 * 60 * 60

// GET endpoints whose responses change rarely, and so can be reused by the
// browser (including across page reloads) for the given number of seconds
const BROWSER_CACHE_SECONDS: Record<string, number> = {
  'filter/WorkOrder': FOUR_HOURS_IN_SECONDS,
}

// Catch-all endpoint. Assumes incoming requests have paths and params
// matching those on the service API endpoint so it can forward them
// without any additional knowledge.
export default authoriseServiceAPIRequest(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const data = await serviceAPIRequest(req)

      const cacheSeconds =
        req.method?.toUpperCase() === 'GET' &&
        BROWSER_CACHE_SECONDS[[req.query.path].flat().join('/')]

      if (cacheSeconds) {
        // `private` as the response depends on the signed in user, and
        // `Vary: Cookie` stops it being reused if someone else signs in
        res.setHeader('Cache-Control', `private, max-age=${cacheSeconds}`)
        res.setHeader('Vary', 'Cookie')
      }

      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      const errorToThrow: Error & { response?: unknown } = new Error(error)

      errorToThrow.response = error.response
      throw errorToThrow
    }
  }
)
