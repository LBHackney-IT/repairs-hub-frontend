import * as HttpStatus from 'http-status-codes'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '@/utils/serviceApiClient'

export default authoriseServiceAPIRequest(async (req, res, user) => {
  req.query = { path: ['properties', req.query.id] }

  const data = await serviceAPIRequest(req, res)

  // redact contact information for contractor responses
  if (
    user.hasAgentPermissions ||
    user.hasContractManagerPermissions ||
    user.hasAuthorisationManagerPermissions
  ) {
    res.status(HttpStatus.OK).json(data)
  } else {
    res.status(HttpStatus.OK).json({ ...data, contacts: ['REMOVED'] })
  }
})
