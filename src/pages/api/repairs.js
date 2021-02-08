import * as HttpStatus from 'http-status-codes'

import { CONTRACTOR_ROLE } from '../../utils/user'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '../../utils/service-api-client'

export default authoriseServiceAPIRequest(async (req, res, user) => {
  let { path, ...queryParams } = req.query

  // Inject contractor query param for repair index requests
  if (req.method.toLowerCase() === 'get' && user.hasRole(CONTRACTOR_ROLE)) {
    req.query = {
      path,
      ...queryParams,
      ContractorReference: user.contractorReference,
    }
  }

  const data = await serviceAPIRequest(req)

  res.status(HttpStatus.OK).json(data)
})
