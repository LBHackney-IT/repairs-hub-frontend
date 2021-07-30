import * as HttpStatus from 'http-status-codes'

import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '../../utils/serviceApiClient'

// Catch-all endpoint. Assumes incoming requests have paths and params
// matching those on the service API endpoint so it can forward them
// without any additional knowledge.
export default authoriseServiceAPIRequest(async (req, res) => {
  const data = await serviceAPIRequest(req, res)

  res.status(HttpStatus.OK).json(data)
})
