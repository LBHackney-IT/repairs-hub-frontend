import * as HttpStatus from 'http-status-codes'
import {
  authoriseServiceAPIRequest,
  serviceAPIRequest,
} from '@/utils/serviceApiClient'

export default authoriseServiceAPIRequest(async (req, res) => {
  req.query = { path: ['properties', 'asset-id', req.query.id] }

  try {
    const data = await serviceAPIRequest(req, res)

    res.status(HttpStatus.OK).json(data)
  } catch (error) {
    const errorToThrow = new Error(error)

    errorToThrow.response = error.response
    throw errorToThrow
  }
})
