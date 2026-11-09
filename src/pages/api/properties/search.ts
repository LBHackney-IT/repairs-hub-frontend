import * as HttpStatus from 'http-status-codes'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '@/utils/serviceApiClient'

export default authoriseServiceAPIRequest(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const searchTextKey = 'searchText'
    const propertySearchPath = ['properties', 'search']

    req.query = {
      path: propertySearchPath,
      [searchTextKey]: req.query.searchText,
      pageSize: process.env.NEXT_PUBLIC_PROPERTIES_PAGE_SIZE,
      pageNumber: req.query.pageNumber,
    }

    try {
      const data = await serviceAPIRequest(req)

      res.status(HttpStatus.OK).json(data)
    } catch (error) {
      const errorToThrow: Error & { response?: unknown } = new Error(error)

      errorToThrow.response = error.response
      throw errorToThrow
    }
  }
)
