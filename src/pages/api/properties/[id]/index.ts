import * as HttpStatus from 'http-status-codes'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '@/utils/serviceApiClient'
import { PropertyResponse } from '@/root/src/models/propertyResponse'

export default authoriseServiceAPIRequest(async (req, res, user) => {
  req.query = { path: ['properties', req.query.id] }

  try {
    const data: PropertyResponse = await serviceAPIRequest(req)

    // redact contact information for contractor responses
    if (
      user.hasAgentPermissions ||
      user.hasContractManagerPermissions ||
      user.hasAuthorisationManagerPermissions
    ) {
      res.status(HttpStatus.OK).json(data)
    } else {
      res.status(HttpStatus.OK).json({ ...data, contactDetails: ['REMOVED'] })
    }
  } catch (error) {
    const errorToThrow = new Error(error)

    errorToThrow.message = error.response
    throw errorToThrow
  }
})
