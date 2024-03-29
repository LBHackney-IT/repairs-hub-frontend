import * as HttpStatus from 'http-status-codes'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '@/utils/serviceApiClient'

export default authoriseServiceAPIRequest(async (req, res) => {
  req.query = {
    path: ['properties', req.query.id, 'person-alerts'],
  }

  try {
    const data = await serviceAPIRequest(req, res)

    res.status(HttpStatus.StatusCodes.OK).json(data)
  } catch (error) {
    const errorToThrow = new Error(error)

    errorToThrow.response = error.response
    throw errorToThrow
  }
})
