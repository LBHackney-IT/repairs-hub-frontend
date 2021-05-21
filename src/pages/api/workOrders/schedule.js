import * as HttpStatus from 'http-status-codes'
// import { AGENT_ROLE, CONTRACT_MANAGER_ROLE } from '../../../utils/user'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '../../../utils/service-api-client'

export default authoriseServiceAPIRequest(async (req, res) => {
  req.query = { path: ['workOrders', 'schedule'] }

  const data = await serviceAPIRequest(req)

  res.status(HttpStatus.OK).json(data)
})
