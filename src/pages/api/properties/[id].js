import * as HttpStatus from 'http-status-codes'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACT_MANAGER_ROLE,
} from '../../../utils/user'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '../../../utils/service-api-client'

export default authoriseServiceAPIRequest(async (req, res, user) => {
  req.query = { path: ['properties', req.query.id] }

  const data = await serviceAPIRequest(req)

  // redact contact information for contractor responses
  if (
    user.hasRole(AGENT_ROLE) ||
    user.hasRole(CONTRACT_MANAGER_ROLE) ||
    user.hasRole(AUTHORISATION_MANAGER_ROLE)
  ) {
    res.status(HttpStatus.OK).json(data)
  } else {
    res.status(HttpStatus.OK).json({ ...data, contacts: ['REMOVED'] })
  }
})
