/** @jest-environment node */
import axios from 'axios'
import loglevel from 'loglevel'
import { createRequest, createResponse } from 'node-mocks-http'
import { getApiToken, getAuthenticatedUser } from './auth/auth'
import { paramsSerializer } from './urls'

jest.mock('axios')
jest.mock('./auth/auth')

const SERVICE_URL = 'https://service.example.com'
const API_KEY = 'test-api-key'
const TOKEN = 'test-id-token'

const mockAxios = (axios as unknown) as jest.Mock
const mockGetApiToken = jest.mocked(getApiToken)
const mockGetAuthenticatedUser = jest.mocked(getAuthenticatedUser)

// The module reads these when it loads, so set them before importing it
let client: typeof import('./serviceApiClient')

beforeAll(async () => {
  process.env.REPAIRS_SERVICE_API_URL = SERVICE_URL
  process.env.REPAIRS_SERVICE_API_KEY = API_KEY
  client = await import('./serviceApiClient')
})

// An axios failure that did, or did not, get a response from the server
const axiosError = (properties: object = {}) =>
  Object.assign(new Error('axios failure'), properties)

describe('serviceApiClient', () => {
  let info: jest.SpyInstance
  let error: jest.SpyInstance

  // Spy after the import: the module calls `setLevel`, which replaces the methods
  beforeEach(() => {
    info = jest.spyOn(loglevel, 'info').mockImplementation(() => {})
    error = jest.spyOn(loglevel, 'error').mockImplementation(() => {})
    mockGetApiToken.mockResolvedValue(TOKEN)
    mockAxios.mockResolvedValue({ data: { result: 'ok' }, status: 200 })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe.each([
    ['serviceAPIRequest', () => client.serviceAPIRequest],
    ['externalAPIRequest', () => client.externalAPIRequest],
  ])('%s', (_, getClient) => {
    const request = () =>
      createRequest({ method: 'GET', query: { path: ['properties', '123'] } })

    it('sends the API key and the user token, and asks for JSON', async () => {
      await getClient()(request())

      expect(mockAxios.mock.calls[0][0].headers).toEqual({
        'x-api-key': API_KEY,
        'x-hackney-user': TOKEN,
        Authorization: TOKEN,
        'Content-Type': 'application/json',
      })
    })

    it('gets the token from the incoming request', async () => {
      const req = request()

      await getClient()(req)

      expect(mockGetApiToken).toHaveBeenCalledWith(req)
    })

    it('returns the response data', async () => {
      expect(await getClient()(request())).toEqual({ result: 'ok' })
    })

    it('passes the method, and the query without `path` as params', async () => {
      const req = createRequest({
        method: 'PATCH',
        query: { path: ['properties', '123'], filter: 'open', page: '2' },
      })

      await getClient()(req)

      expect(mockAxios.mock.calls[0][0]).toMatchObject({
        method: 'PATCH',
        params: { filter: 'open', page: '2' },
        paramsSerializer,
      })
      expect(mockAxios.mock.calls[0][0].params).not.toHaveProperty('path')
    })

    it('sends the body when there is one', async () => {
      const req = createRequest({
        method: 'POST',
        query: { path: ['properties'] },
        body: { name: 'new' },
      })

      await getClient()(req)

      expect(mockAxios.mock.calls[0][0].data).toEqual({ name: 'new' })
    })

    it('does not send a body when there is none', async () => {
      const req = request()
      // node-mocks-http defaults the body to {}, a real GET has none
      req.body = undefined

      await getClient()(req)

      expect(mockAxios.mock.calls[0][0]).not.toHaveProperty('data')
    })

    it('throws an error carrying the response when the request fails with one', async () => {
      const response = { status: 500, data: 'upstream error' }
      mockAxios.mockRejectedValue(axiosError({ response }))

      await expect(getClient()(request())).rejects.toMatchObject({ response })
    })

    it('never logs the token, API key, body, query values or response data', async () => {
      mockAxios.mockResolvedValue({
        data: { secret: 'RESPONSE-DATA' },
        status: 200,
      })

      await getClient()(
        createRequest({
          method: 'POST',
          query: { path: ['properties'], search: 'QUERY-VALUE' },
          body: { name: 'BODY-VALUE' },
        })
      )

      const logged = JSON.stringify([...info.mock.calls, ...error.mock.calls])

      expect(logged).not.toMatch(
        new RegExp(`${TOKEN}|${API_KEY}|BODY-VALUE|QUERY-VALUE|RESPONSE-DATA`)
      )
    })
  })

  it.todo(
    'reports a network failure (no response) as "No response received" (needs the dropped `.request` fixed)'
  )

  describe('serviceAPIRequest URL and logging', () => {
    it('calls the Service API with the path joined onto its URL', async () => {
      await client.serviceAPIRequest(
        createRequest({ method: 'GET', query: { path: ['properties', '123'] } })
      )

      expect(mockAxios.mock.calls[0][0].url).toBe(
        `${SERVICE_URL}/properties/123`
      )
    })

    it('logs one line with the method, URL and status', async () => {
      await client.serviceAPIRequest(
        createRequest({ method: 'GET', query: { path: ['properties', '123'] } })
      )

      expect(info).toHaveBeenCalledTimes(1)
      expect(info).toHaveBeenCalledWith(
        `Service API GET ${SERVICE_URL}/properties/123: 200`
      )
    })
  })

  describe('externalAPIRequest URL and logging', () => {
    const external = () =>
      createRequest({
        method: 'DELETE',
        query: { path: ['https://contacts.example.com', 'api', 'v1'] },
      })

    it('uses the joined path alone as the URL', async () => {
      await client.externalAPIRequest(external())

      expect(mockAxios.mock.calls[0][0].url).toBe(
        'https://contacts.example.com/api/v1'
      )
    })

    it('logs one line with the method, URL and status', async () => {
      await client.externalAPIRequest(external())

      expect(info).toHaveBeenCalledTimes(1)
      expect(info).toHaveBeenCalledWith(
        'External API DELETE https://contacts.example.com/api/v1: 200'
      )
    })
  })

  describe('authoriseServiceAPIRequest', () => {
    const user = { name: 'Ada', hasAnyPermissions: true }
    const callback = jest.fn()

    const run = async (handler = callback) => {
      const req = createRequest()
      const res = createResponse()

      const result = await client.authoriseServiceAPIRequest(handler)(req, res)

      return { req, res, result }
    }

    const body = (res: ReturnType<typeof createResponse>) =>
      JSON.parse(res._getData())

    describe('when there is no session', () => {
      it('returns 401 and does not call the handler', async () => {
        mockGetAuthenticatedUser.mockResolvedValue(null)

        const { res } = await run()

        expect(res._getStatusCode()).toBe(401)
        expect(body(res)).toEqual({ message: 'Auth cookie missing.' })
        expect(callback).not.toHaveBeenCalled()
      })
    })

    describe('when there is a session', () => {
      beforeEach(() => {
        mockGetAuthenticatedUser.mockResolvedValue(user as never)
      })

      it('calls the handler with the request, response and user', async () => {
        callback.mockResolvedValue(undefined)

        const { req, res } = await run()

        expect(callback).toHaveBeenCalledWith(req, res, user)
      })

      it('returns what the handler returns', async () => {
        callback.mockResolvedValue('handler result')

        expect((await run()).result).toBe('handler result')
      })

      describe('when the handler fails with an upstream response', () => {
        const fail = (response: object) => {
          callback.mockRejectedValue(axiosError({ response }))
        }

        it('returns 404 with the upstream message', async () => {
          fail({ status: 404, data: 'No such property' })

          const { res } = await run()

          expect(res._getStatusCode()).toBe(404)
          expect(body(res)).toEqual({ message: 'No such property' })
        })

        it('falls back to "Resource not found" when a 404 has no message', async () => {
          fail({ status: 404 })

          const { res } = await run()

          expect(body(res)).toEqual({ message: 'Resource not found' })
        })

        it.each([422, 500])(
          'passes a %s through with its message',
          async (status) => {
            fail({ status, data: 'upstream message' })

            const { res } = await run()

            expect(res._getStatusCode()).toBe(status)
            expect(body(res)).toEqual({ message: 'upstream message' })
          }
        )

        it('falls back to "Service API error" when another status has no message', async () => {
          fail({ status: 500 })

          const { res } = await run()

          expect(body(res)).toEqual({ message: 'Service API error' })
        })

        it('logs the status and message but not the upstream headers', async () => {
          fail({
            status: 500,
            data: 'upstream message',
            headers: { 'set-cookie': 'SECRET-HEADER' },
          })

          await run()

          const logged = JSON.stringify(error.mock.calls)

          expect(logged).toContain('upstream message')
          expect(logged).toContain('500')
          expect(logged).not.toContain('SECRET-HEADER')
        })
      })

      it('returns 500 "No response received" when the request got no response', async () => {
        callback.mockRejectedValue(axiosError({ request: {} }))

        const { res } = await run()

        expect(res._getStatusCode()).toBe(500)
        expect(body(res)).toEqual({
          message: 'No response received from Service API',
        })
      })

      it('returns 500 "request setup error" for any other error', async () => {
        callback.mockRejectedValue(new Error('something broke'))

        const { res } = await run()

        expect(res._getStatusCode()).toBe(500)
        expect(body(res)).toEqual({ message: 'API Client request setup error' })
      })
    })

    it('returns 500 "request setup error" when looking up the user fails', async () => {
      mockGetAuthenticatedUser.mockRejectedValue(new Error('cookie exploded'))

      const { res } = await run()

      expect(res._getStatusCode()).toBe(500)
      expect(body(res)).toEqual({ message: 'API Client request setup error' })
    })
  })
})
