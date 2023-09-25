import * as HttpStatus from 'http-status-codes'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '@/utils/serviceApiClient'

export default authoriseServiceAPIRequest(async (req, res, user) => {
  req.query = { path: ['contact-details', req.query.id] }

  if (
    !user.hasAgentPermissions &&
    !user.hasContractManagerPermissions &&
    !user.hasAuthorisationManagerPermissions
  ) {
    // redact contact information for contractor responses
    res.status(HttpStatus.OK).json(['REMOVED'])
    return
  }

  try {
    const data = await serviceAPIRequest(req, res)
    res.status(HttpStatus.OK).json(data)
  } catch (error) {
    const errorToThrow = new Error(error)

    errorToThrow.response = error.response
    throw errorToThrow
  }
})
