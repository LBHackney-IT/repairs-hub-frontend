import * as HttpStatus from 'http-status-codes'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '@/utils/serviceApiClient'

const mockResponse = {
  propertyReference: '00023404',
  address: {
    shortAddress: '16 Pitcairn House St Thomass Square',
    postalCode: 'E9 6PT',
    addressLine: '16 Pitcairn House St Thomass Square',
    streetSuffix: null,
  },
  hierarchyType: {
    levelCode: null,
    subTypeCode: null,
    subTypeDescription: 'Dwelling',
  },
  tmoName: 'London Borough of Hackney',
  canRaiseRepair: false,
}

export default authoriseServiceAPIRequest(async (req, res, user) => {
  req.query = { path: ['properties', 'asset-id', req.query.id] }

  try {
    // const data = await serviceAPIRequest(req, res)

    // res.status(HttpStatus.OK).json(data )
    res.status(HttpStatus.OK).json(mockResponse)
  } catch (error) {
    const errorToThrow = new Error(error)

    errorToThrow.response = error.response
    throw errorToThrow
  }
})
