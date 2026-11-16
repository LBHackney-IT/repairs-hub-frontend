/** @jest-environment node */
import axios from 'axios'
import { authorisedRouteRequest } from 'factories/api_route'
import { paramsSerializer } from '@/utils/urls'

import assetIdEndpoint from './index'

jest.mock('axios')

const mockAxios = (axios as unknown) as jest.Mock

const { REPAIRS_SERVICE_API_URL } = process.env

describe('GET /api/properties/asset-id/[id]', () => {
  afterEach(() => {
    mockAxios.mockReset()
  })

  it('makes the equivalent service API request and returns the response', async () => {
    const { req, res, upstreamHeaders } = await authorisedRouteRequest({
      method: 'GET',
      query: { id: 'some-guid' },
    })

    mockAxios.mockResolvedValueOnce({ status: 200, data: { id: 'some-guid' } })

    await assetIdEndpoint(req, res)

    expect(mockAxios).toHaveBeenCalledWith({
      method: 'GET',
      headers: upstreamHeaders,
      url: `${REPAIRS_SERVICE_API_URL}/properties/guid-pk/some-guid`,
      params: {},
      paramsSerializer,
      data: {},
    })
    expect(JSON.parse(res._getData())).toEqual({ id: 'some-guid' })
  })
})
