import * as HttpStatus from 'http-status-codes'

import { CONTRACTOR_ROLE } from '../../../utils/user'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '../../../utils/service-api-client'

export default authoriseServiceAPIRequest(async (req, res, user) => {
  req.query = { path: ['properties', req.query.id] }

  const data = await serviceAPIRequest(req)

  // redact contact information for contractor responses
  if (user.hasRole(CONTRACTOR_ROLE)) {
    res.status(HttpStatus.OK).json({ ...data, contacts: '[REMOVED]' })
  } else {
    res.status(HttpStatus.OK).json(data)
  }
})
