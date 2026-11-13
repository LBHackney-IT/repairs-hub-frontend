/** @jest-environment node */
import axios from 'axios'
import * as HttpStatus from 'http-status-codes'
import { createRequest, createResponse } from 'node-mocks-http'
import { authorisedRouteRequest } from 'factories/api_route'
import { signSessionCookie } from 'factories/session_cookie'
import { paramsSerializer } from '@/utils/urls'

import catchAllEndpoint from './[...path]'

jest.mock('axios')

const mockAxios = (axios as unknown) as jest.Mock

const { REPAIRS_SERVICE_API_URL } = process.env

describe('/api/[...path]', () => {
  afterEach(() => {
    mockAxios.mockReset()
  })

  it('returns a not authorised error when there is no auth cookie', async () => {
    const req = createRequest()
    const res = createResponse()

    await catchAllEndpoint(req, res)

    expect(res._getStatusCode()).toBe(HttpStatus.UNAUTHORIZED)
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Auth cookie missing.',
    })
    expect(mockAxios).not.toHaveBeenCalled()
  })

  it('returns a not authorised error when the cookie was signed with an unrecognised secret', async () => {
    const session = await signSessionCookie({ secret: 'some-other-secret' })
    const req = createRequest(session.requestOptions)
    const res = createResponse()

    await catchAllEndpoint(req, res)

    expect(res._getStatusCode()).toBe(HttpStatus.UNAUTHORIZED)
    expect(mockAxios).not.toHaveBeenCalled()
  })

  describe('when the request is authorised', () => {
    describe('a GET request', () => {
      it('makes the equivalent service API request and returns the response', async () => {
        const { req, res, upstreamHeaders } = await authorisedRouteRequest({
          method: 'GET',
          // how Next structures a catch-all route
          query: { path: ['a', 'nested', 'path'], queryKey: 'a query value' },
        })

        mockAxios.mockResolvedValueOnce({
          status: 200,
          data: { key: 'hackney' },
        })

        await catchAllEndpoint(req, res)

        expect(mockAxios).toHaveBeenCalledTimes(1)
        expect(mockAxios).toHaveBeenCalledWith({
          method: 'GET',
          headers: upstreamHeaders,
          url: `${REPAIRS_SERVICE_API_URL}/a/nested/path`,
          params: { queryKey: 'a query value' },
          paramsSerializer,
          data: {}, // node-mocks-http gives every request an empty body
        })

        expect(res._getStatusCode()).toBe(200)
        expect(JSON.parse(res._getData())).toEqual({ key: 'hackney' })
      })
    })

    describe('a POST request', () => {
      it('forwards the body to the equivalent service API request', async () => {
        const { req, res, upstreamHeaders } = await authorisedRouteRequest({
          method: 'POST',
          query: { path: ['workOrders'] },
          body: { description: 'a body value' },
        })

        mockAxios.mockResolvedValueOnce({ status: 200, data: {} })

        await catchAllEndpoint(req, res)

        expect(mockAxios).toHaveBeenCalledTimes(1)
        expect(mockAxios).toHaveBeenCalledWith({
          method: 'POST',
          headers: upstreamHeaders,
          url: `${REPAIRS_SERVICE_API_URL}/workOrders`,
          params: {},
          paramsSerializer,
          data: { description: 'a body value' },
        })

        expect(res._getStatusCode()).toBe(200)
      })
    })

    describe('reflects errors from the service API', () => {
      it('when it returns a 404 not found', async () => {
        const { req, res } = await authorisedRouteRequest({
          method: 'GET',
          query: { path: ['path'] },
        })

        mockAxios.mockRejectedValueOnce({
          response: { status: HttpStatus.NOT_FOUND, data: 'error message' },
        })

        await catchAllEndpoint(req, res)

        expect(res._getStatusCode()).toBe(HttpStatus.NOT_FOUND)
        expect(JSON.parse(res._getData())).toEqual({
          message: 'error message',
        })
      })

      it('when it returns a 500 internal server error', async () => {
        const { req, res } = await authorisedRouteRequest({
          method: 'POST',
          query: { path: ['path'] },
        })

        mockAxios.mockRejectedValueOnce({
          response: { status: HttpStatus.INTERNAL_SERVER_ERROR },
        })

        await catchAllEndpoint(req, res)

        expect(res._getStatusCode()).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
        expect(JSON.parse(res._getData())).toEqual({
          message: 'Service API error',
        })
      })
    })
  })
})
