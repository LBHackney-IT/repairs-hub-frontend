import * as HttpStatus from 'http-status-codes'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '../../../utils/service-api-client'

import {
  calculateCompletionDateTime,
  PriorityCodeError,
} from '../../../utils/helpers/completionDateTimes'

export default authoriseServiceAPIRequest(async (req, res) => {
  req.query = { path: ['workOrders', 'schedule'] }

  try {
    const priorityCode = req.body?.priority?.priorityCode

    req.body = {
      ...req.body,
      priority: {
        ...req.body.priority,
        requiredCompletionDateTime: calculateCompletionDateTime(priorityCode),
      },
    }

    const data = await serviceAPIRequest(req)

    res.status(HttpStatus.OK).json(data)
  } catch (e) {
    if (e instanceof PriorityCodeError) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Priority code missing or invalid',
      })
    } else {
      throw e
    }
  }
})
