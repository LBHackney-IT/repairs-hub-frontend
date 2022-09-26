import * as HttpStatus from 'http-status-codes'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '@/utils/serviceApiClient'

export default authoriseServiceAPIRequest(async (req, res) => {
  const searchTextKey = 'searchText'
  const propertySearchPath = ['properties', 'search']

  req.query = {
    path: propertySearchPath,
    [searchTextKey]: req.query.searchText,
    pageSize: process.env.NEXT_PUBLIC_PROPERTIES_PAGE_SIZE,
    pageNumber: req.query.pageNumber,
  }

  try {
    const data = await serviceAPIRequest(req, res)

    res.status(HttpStatus.OK).json(data)
  } catch (error) {
    const errorToThrow = new Error(error)

    errorToThrow.response = error.response
    throw errorToThrow
  }
})
