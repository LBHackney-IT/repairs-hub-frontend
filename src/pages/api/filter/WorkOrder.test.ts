/** @jest-environment node */
import axios from 'axios'
import * as HttpStatus from 'http-status-codes'
import { createRequest, createResponse } from 'node-mocks-http'
import { authorisedRouteRequest } from 'factories/api_route'
import { paramsSerializer } from '@/utils/urls'

import workOrderFiltersEndpoint from './WorkOrder'

jest.mock('axios')

const mockAxios = (axios as unknown) as jest.Mock

const { REPAIRS_SERVICE_API_URL } = process.env

describe('/api/filter/WorkOrder', () => {
  afterEach(() => {
    mockAxios.mockReset()
  })

  it('returns a not authorised error when there is no auth cookie', async () => {
    const res = createResponse()

    await workOrderFiltersEndpoint(createRequest({ method: 'GET' }), res)

    expect(res._getStatusCode()).toBe(HttpStatus.UNAUTHORIZED)
    expect(res.getHeader('Cache-Control')).toBeUndefined()
    expect(mockAxios).not.toHaveBeenCalled()
  })

  it('requests the filters from the service API and returns them', async () => {
    mockAxios.mockResolvedValueOnce({ status: 200, data: { Status: [] } })
    const { req, res, upstreamHeaders } = await authorisedRouteRequest({
      method: 'GET',
    })

    await workOrderFiltersEndpoint(req, res)

    expect(mockAxios).toHaveBeenCalledTimes(1)
    expect(mockAxios).toHaveBeenCalledWith({
      method: 'GET',
      headers: upstreamHeaders,
      url: `${REPAIRS_SERVICE_API_URL}/filter/WorkOrder`,
      params: {},
      paramsSerializer,
      data: {},
    })
    expect(res._getStatusCode()).toBe(HttpStatus.OK)
    expect(JSON.parse(res._getData())).toEqual({ Status: [] })
  })

  it('lets the browser cache the response for four hours, per user', async () => {
    mockAxios.mockResolvedValueOnce({ status: 200, data: {} })
    const { req, res } = await authorisedRouteRequest({ method: 'GET' })

    await workOrderFiltersEndpoint(req, res)

    expect(res.getHeader('Cache-Control')).toBe('private, max-age=14400')
    expect(res.getHeader('Vary')).toBe('Cookie')
  })

  it('does not forward query parameters to the service API', async () => {
    mockAxios.mockResolvedValueOnce({ status: 200, data: {} })
    const { req, res } = await authorisedRouteRequest({
      method: 'GET',
      query: { anything: 'else' },
    })

    await workOrderFiltersEndpoint(req, res)

    expect(mockAxios.mock.calls[0][0].params).toEqual({})
  })

  it('does not cache an error from the service API', async () => {
    mockAxios.mockRejectedValueOnce({
      response: { status: HttpStatus.INTERNAL_SERVER_ERROR },
    })
    const { req, res } = await authorisedRouteRequest({ method: 'GET' })

    await workOrderFiltersEndpoint(req, res)

    expect(res._getStatusCode()).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(res.getHeader('Cache-Control')).toBeUndefined()
  })

  it('only allows GET requests', async () => {
    const { req, res } = await authorisedRouteRequest({ method: 'POST' })

    await workOrderFiltersEndpoint(req, res)

    expect(res._getStatusCode()).toBe(HttpStatus.METHOD_NOT_ALLOWED)
    expect(res.getHeader('Allow')).toBe('GET')
    expect(mockAxios).not.toHaveBeenCalled()
  })
})
