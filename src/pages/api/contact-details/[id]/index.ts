import * as HttpStatus from 'http-status-codes'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '@/utils/serviceApiClient'
import type { buildUser } from '@/utils/user'

export default authoriseServiceAPIRequest(
  async (
    req: NextApiRequest,
    res: NextApiResponse,
    user: ReturnType<typeof buildUser>
  ) => {
    req.query = { path: ['contact-details', req.query.id as string] }

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
      const data = await serviceAPIRequest(req)
      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      const errorToThrow: Error & { response?: unknown } = new Error(error)

      errorToThrow.response = error.response
      throw errorToThrow
    }
  }
)
