/** @jest-environment node */
import axios from 'axios'
import { authorisedRouteRequest } from 'factories/api_route'
import { paramsSerializer } from '@/utils/urls'

import searchEndpoint from './search'

jest.mock('axios')

const mockAxios = (axios as unknown) as jest.Mock

const {
  REPAIRS_SERVICE_API_URL,
  NEXT_PUBLIC_PROPERTIES_PAGE_SIZE,
} = process.env

describe('GET /api/properties/search', () => {
  afterEach(() => {
    mockAxios.mockReset()
  })

  it('searches the service API with the page size from the config', async () => {
    const { req, res, upstreamHeaders } = await authorisedRouteRequest({
      method: 'GET',
      query: { searchText: '1 Hillman Street', pageNumber: '2' },
    })

    mockAxios.mockResolvedValueOnce({ status: 200, data: { results: [] } })

    await searchEndpoint(req, res)

    expect(mockAxios).toHaveBeenCalledWith({
      method: 'GET',
      headers: upstreamHeaders,
      url: `${REPAIRS_SERVICE_API_URL}/properties/search`,
      params: {
        searchText: '1 Hillman Street',
        pageSize: NEXT_PUBLIC_PROPERTIES_PAGE_SIZE,
        pageNumber: '2',
      },
      paramsSerializer,
      data: {},
    })
    expect(JSON.parse(res._getData())).toEqual({ results: [] })
  })
})
