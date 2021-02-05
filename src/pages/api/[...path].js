import cookie from 'cookie'
import * as HttpStatus from 'http-status-codes'

import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '../../utils/service-api-client'

const { GSSO_TOKEN_NAME } = process.env

// Catch-all endpoint. Assumes incoming requests have paths and params
// matching those on the service API endpoint so it can forward them
// without any additional knowledge.
export default authoriseServiceAPIRequest(async (req, res) => {
  const cookies = cookie.parse(req.headers.cookie ?? '')
  const token = cookies[GSSO_TOKEN_NAME]

  const data = await serviceAPIRequest(req, token)

  res.status(HttpStatus.OK).json(data)
})
