/** @jest-environment node */
import axios from 'axios'
import { authorisedRouteRequest } from 'factories/api_route'
import { paramsSerializer } from '@/utils/urls'

import personAlertsEndpoint from './person-alerts'

jest.mock('axios')

const mockAxios = (axios as unknown) as jest.Mock

const { REPAIRS_SERVICE_API_URL } = process.env

describe('GET /api/properties/[id]/person-alerts', () => {
  afterEach(() => {
    mockAxios.mockReset()
  })

  it('makes the equivalent service API request and returns the response', async () => {
    const tenureId = 'b33dc0d3-4acf-4173-98fc-60742a793ca7'
    const { req, res, upstreamHeaders } = await authorisedRouteRequest({
      method: 'GET',
      query: { id: tenureId },
    })

    mockAxios.mockResolvedValueOnce({ status: 200, data: [{ alert: 'a' }] })

    await personAlertsEndpoint(req, res)

    expect(mockAxios).toHaveBeenCalledWith({
      method: 'GET',
      headers: upstreamHeaders,
      url: `${REPAIRS_SERVICE_API_URL}/properties/${tenureId}/person-alerts`,
      params: {},
      paramsSerializer,
      data: {},
    })
    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual([{ alert: 'a' }])
  })
})
