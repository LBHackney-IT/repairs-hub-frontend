import * as HttpStatus from 'http-status-codes'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '@/utils/serviceApiClient'

export default authoriseServiceAPIRequest(async (req, res) => {
  let searchTextKey
  let propertySearchPath

  if (process.env.NEXT_PUBLIC_USE_DEPRECATED_PROPERTY_SEARCH === 'true') {
    searchTextKey = 'q'
    propertySearchPath = ['properties']
  } else {
    searchTextKey = 'searchText'
    propertySearchPath = ['properties', 'search']
  }

  req.query = {
    path: propertySearchPath,
    [searchTextKey]: req.query.searchText,
    pageSize: process.env.NEXT_PUBLIC_PROPERTIES_PAGE_SIZE,
    pageNumber: req.query.pageNumber,
  }

  try {
    let data = await serviceAPIRequest(req, res)

    if (process.env.NEXT_PUBLIC_USE_DEPRECATED_PROPERTY_SEARCH === 'true') {
      data = { properties: data, total: data.length }
    }

    res.status(HttpStatus.OK).json(data)
  } catch (error) {
    throw Error(error)
  }
})
