import * as HttpStatus from 'http-status-codes'
import { createDRSSession } from '../../../utils/scheduling/drs/webServices/sessions'
import { authoriseServiceAPIRequest } from '../../../utils/serviceApiClient'

export default authoriseServiceAPIRequest(async (req, res) => {
  try {
    const data = {
      schedulerSessionId: await createDRSSession(),
    }

    res.status(HttpStatus.OK).json(data)
  } catch (e) {
    console.error(`Cannot create DRS Web Services session with error: ${e}`)

    res.status(e?.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: `Unable to connect to DRS Web Services to allow scheduling of this order (${e})`,
    })
  }
})
