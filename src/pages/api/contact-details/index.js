import * as HttpStatus from 'http-status-codes'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '@/utils/serviceApiClient'

export default authoriseServiceAPIRequest(async (req, res, user) => {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') return

  req.query = {
    path: [
      process.env.NEXT_PUBLIC_CONTACT_DETAILS_API_URL,
      'api',
      'v1',
      'contactDetails',
    ],
    id: req.query.contactId,
    targetId: req.query.personId,
  }

  console.log(req.query)

  // if (
  //   !user.hasAgentPermissions &&
  //   !user.hasContractManagerPermissions &&
  //   !user.hasAuthorisationManagerPermissions
  // ) {
  //   // redact contact information for contractor responses
  //   res.status(HttpStatus.OK).json(['REMOVED'])
  //   return
  // }

  try {
    const data = await serviceAPIRequest(req, res)
    res.status(HttpStatus.OK).json(data)
  } catch (error) {
    const errorToThrow = new Error(error)

    errorToThrow.response = error.response
    throw errorToThrow
  }
})
