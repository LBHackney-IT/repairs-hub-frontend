import * as HttpStatus from 'http-status-codes'

import { serviceAPIRequest } from '../../utils/service-api-client'
import { isAuthorised } from '../../utils/GoogleAuth'

// Catch-all endpoint. Assumes incoming requests have paths and params
// matching those on the service API endpoint so it can forward them
// without any additional knowledge.
export default async (req, res) => {
  const user = isAuthorised({ req })
  if (!user) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Auth cookie missing.' })
  }
  try {
    const data = await serviceAPIRequest(req.method, req.query, req.body)

    res.status(HttpStatus.OK).json(data)
  } catch (err) {
    console.log(`Service API ${req.method} error:`, err)

    err?.response?.status === HttpStatus.NOT_FOUND
      ? res.status(HttpStatus.NOT_FOUND).json({ message: `Resource not found` })
      : res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Service API server error' })
  }
}
