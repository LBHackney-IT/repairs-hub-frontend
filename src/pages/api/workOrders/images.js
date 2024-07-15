import * as HttpStatus from 'http-status-codes'

import {
  authoriseServiceAPIRequest,
  serviceAPIRequestForUpload,
} from '@/utils/serviceApiClient'

// Catch-all endpoint. Assumes incoming requests have paths and params
// matching those on the service API endpoint so it can forward them
// without any additional knowledge.
export default authoriseServiceAPIRequest(async (req, res) => {
  // res.status(HttpStatus.NO_CONTENT).send()

  req.query = { path: ['workOrders', 'images'] }

  try {
    const data = await serviceAPIRequestForUpload(req, res)

    res.status(HttpStatus.OK).json(data)
  } catch (error) {
    const errorToThrow = new Error(error)

    errorToThrow.response = error.response
    throw errorToThrow
  }
})

export const config = {
  api: {
    bodyParser: false,
  },
}
