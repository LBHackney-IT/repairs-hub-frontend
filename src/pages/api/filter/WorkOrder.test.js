import axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import * as HttpStatus from 'http-status-codes'
import { createRequest, createResponse } from 'node-mocks-http'
import { paramsSerializer } from '@/utils/urls'

import workOrderFiltersEndpoint from './WorkOrder'

jest.mock('axios')

const {
  REPAIRS_SERVICE_API_URL,
  REPAIRS_SERVICE_API_KEY,
  HACKNEY_JWT_SECRET,
  GSSO_TOKEN_NAME,
  AGENTS_GOOGLE_GROUPNAME,
} = process.env

describe('/api/filter/WorkOrder', () => {
  const signedCookie = jsonwebtoken.sign(
    {
      name: 'name',
      email: 'name@example.com',
      groups: [AGENTS_GOOGLE_GROUPNAME],
    },
    HACKNEY_JWT_SECRET
  )

  const getRequest = (overrides = {}) =>
    createRequest({
      method: 'GET',
      headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
      ...overrides,
    })

  beforeEach(() => {
    axios.mockReset()
    axios.create = jest.fn(() => axios)
  })

  test('returns a not authorised error when there is no auth cookie', async () => {
    const res = createResponse()

    await workOrderFiltersEndpoint(createRequest({ method: 'GET' }), res)

    expect(res._getStatusCode()).toBe(HttpStatus.UNAUTHORIZED)
    expect(res.getHeader('Cache-Control')).toBeUndefined()
  })

  test('requests the filters from the service API and returns them', async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({ status: 200, data: { Status: [] } })
    )
    const res = createResponse()

    await workOrderFiltersEndpoint(getRequest(), res)

    expect(axios).toHaveBeenCalledTimes(1)
    expect(axios).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': REPAIRS_SERVICE_API_KEY,
        'x-hackney-user': signedCookie,
        Authorization: signedCookie,
      },
      url: `${REPAIRS_SERVICE_API_URL}/filter/WorkOrder`,
      params: {},
      paramsSerializer,
      data: {},
    })
    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual({ Status: [] })
  })

  test('lets the browser cache the response for four hours, per user', async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({ status: 200, data: {} })
    )
    const res = createResponse()

    await workOrderFiltersEndpoint(getRequest(), res)

    expect(res.getHeader('Cache-Control')).toBe('private, max-age=14400')
    expect(res.getHeader('Vary')).toBe('Cookie')
  })

  test('does not forward query parameters to the service API', async () => {
    axios.mockImplementationOnce(() =>
      Promise.resolve({ status: 200, data: {} })
    )

    await workOrderFiltersEndpoint(
      getRequest({ query: { anything: 'else' } }),
      createResponse()
    )

    expect(axios.mock.calls[0][0].params).toEqual({})
  })

  test('does not cache an error from the service API', async () => {
    axios.mockImplementationOnce(() =>
      Promise.reject({ response: { status: HttpStatus.INTERNAL_SERVER_ERROR } })
    )
    const res = createResponse()

    await workOrderFiltersEndpoint(getRequest(), res)

    expect(res._getStatusCode()).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(res.getHeader('Cache-Control')).toBeUndefined()
  })

  test('only allows GET requests', async () => {
    const res = createResponse()

    await workOrderFiltersEndpoint(getRequest({ method: 'POST' }), res)

    expect(res._getStatusCode()).toBe(HttpStatus.METHOD_NOT_ALLOWED)
    expect(res.getHeader('Allow')).toBe('GET')
    expect(axios).not.toHaveBeenCalled()
  })
})
