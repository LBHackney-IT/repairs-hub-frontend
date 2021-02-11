import * as HttpStatus from 'http-status-codes'

import { CONTRACTOR_ROLE } from '../../utils/user'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '../../utils/service-api-client'

export default authoriseServiceAPIRequest(async (req, res, user) => {
  // Inject contractor query param for repair index requests
  if (req.method.toLowerCase() === 'get' && user.hasRole(CONTRACTOR_ROLE)) {
    req.query = {
      ...req.query,
      ContractorReference: user.contractorReference,
    }
  }

  req.query = { ...req.query, path: ['repairs'] }

  const data = await serviceAPIRequest(req)

  res.status(HttpStatus.OK).json(data)
})
