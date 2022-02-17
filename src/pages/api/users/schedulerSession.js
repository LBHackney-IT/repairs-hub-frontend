import * as HttpStatus from 'http-status-codes'
import { createDRSSession } from '@/utils/scheduling/drs/webServices/sessions'
import { authoriseServiceAPIRequest } from '@/utils/serviceApiClient'
import { captureException } from '@sentry/nextjs'

export default authoriseServiceAPIRequest(async (req, res) => {
  try {
    const data = {
      schedulerSessionId: await createDRSSession(),
    }

    res.status(HttpStatus.OK).json(data)
  } catch (e) {
    captureException(e)

    console.error(`Cannot create DRS Web Services session with error: ${e}`)

    const errorToThrow = new Error(e)

    errorToThrow.response = {
      status: e?.status,
      data: `Unable to connect to DRS Web Services to allow scheduling of this order (${e})`,
    }
    throw errorToThrow
  }
})
