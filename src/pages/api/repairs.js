import * as HttpStatus from 'http-status-codes'
import cookie from 'cookie'

import { CONTRACTOR_ROLE } from '../../utils/user'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '../../utils/service-api-client'

const { GSSO_TOKEN_NAME } = process.env

export default authoriseServiceAPIRequest(async (req, res, user) => {
  const cookies = cookie.parse(req.headers.cookie ?? '')
  const token = cookies[GSSO_TOKEN_NAME]

  // Inject contractor query param for repair index requests
  if (req.method.toLowerCase() === 'get' && user.hasRole(CONTRACTOR_ROLE)) {
    req.query = {
      ...req.query,
      ContractorReference: user.contractorReference,
    }
  }

  req.query = { ...req.query, path: ['repairs'] }

  const data = await serviceAPIRequest(req, token)

  res.status(HttpStatus.OK).json(data)
})
