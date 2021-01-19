import axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import * as HttpStatus from 'http-status-codes'
import { createRequest, createResponse } from 'node-mocks-http'

import catchAllEndpoint from './[...path].js'

jest.mock('axios', () => jest.fn())

const {
  REPAIRS_SERVICE_API_URL,
  REPAIRS_SERVICE_API_KEY,
  HACKNEY_JWT_SECRET,
  HACKNEY_AUTHORISED_GROUP,
  GSSO_TOKEN_NAME,
} = process.env

const headers = { 'x-api-key': REPAIRS_SERVICE_API_KEY }

describe('/api/[...path]', () => {
  test('returns a not authorised error when there is no auth cookie', async () => {
    const req = createRequest()
    const res = createResponse()

    await catchAllEndpoint(req, res)

    expect(res._getStatusCode()).toBe(HttpStatus.UNAUTHORIZED)
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Auth cookie missing.',
    })
  })

  test('returns a not authorised error when the cookie has been signed with an unrecognised secret', async () => {
    const badSignedCookie = jsonwebtoken.sign(
      {
        name: 'name',
        email: 'name@example.com',
        groups: [HACKNEY_AUTHORISED_GROUP],
      },
      HACKNEY_JWT_SECRET + 'messedWithSecret'
    )

    const req = createRequest({
      headers: { Cookie: `${GSSO_TOKEN_NAME}=${badSignedCookie};` },
    })

    const res = createResponse()

    await catchAllEndpoint(req, res)

    expect(res._getStatusCode()).toBe(HttpStatus.UNAUTHORIZED)
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Auth cookie missing.',
    })
  })

  describe('when the request is authorised', () => {
    // Signed JWT for auth
    const signedCookie = jsonwebtoken.sign(
      {
        name: 'name',
        email: 'name@example.com',
        groups: [HACKNEY_AUTHORISED_GROUP],
      },
      HACKNEY_JWT_SECRET
    )

    describe('reflects errors from the service API', () => {
      test('when it returns a 404 not found', async () => {
        axios.mockImplementationOnce(() =>
          Promise.reject({
            response: { status: HttpStatus.NOT_FOUND },
          })
        )

        const req = createRequest({
          method: 'get',
          headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
          query: {
            path: ['path'],
          },
        })

        const res = createResponse()

        await catchAllEndpoint(req, res)

        expect(res._getStatusCode()).toBe(HttpStatus.NOT_FOUND)
        expect(JSON.parse(res._getData())).toEqual({
          message: 'Resource not found',
        })
      })

      test('when it returns a 500 internal server error', async () => {
        axios.mockImplementationOnce(() =>
          Promise.reject({
            response: { status: HttpStatus.INTERNAL_SERVER_ERROR },
          })
        )

        const req = createRequest({
          method: 'post',
          headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
          query: {
            path: ['path'],
          },
        })

        const res = createResponse()

        await catchAllEndpoint(req, res)

        expect(res._getStatusCode()).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
        expect(JSON.parse(res._getData())).toEqual({
          message: 'Service API server error',
        })
      })
    })

    describe('a GET request', () => {
      test('makes the equivalent service API request and returns the response', async () => {
        // Create a request for the Node API
        const req = createRequest({
          method: 'get',
          headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
          query: {
            path: ['a', 'nested', 'path'], // replicates how Next JS structures API requests
            queryKey: 'a query value',
          },
        })

        const res = createResponse()

        // Mock the return value from the service API
        axios.mockImplementationOnce(() =>
          Promise.resolve({
            status: 200,
            data: { key: 'hackney' },
          })
        )

        // Call the Node API catch-all endpoint function
        await catchAllEndpoint(req, res)

        // Expect an almost-identical call to the service API from our Node API
        expect(axios).toHaveBeenCalledTimes(1)
        expect(axios).toHaveBeenCalledWith({
          method: 'get',
          headers,
          url: `${REPAIRS_SERVICE_API_URL}/a/nested/path`,
          params: { queryKey: 'a query value' },
          data: {}, // no body
        })

        // Expect the Node API response to reflect the service API response
        expect(res._getStatusCode()).toBe(200)
        expect(JSON.parse(res._getData())).toEqual({ key: 'hackney' })
      })
    })

    describe('a POST request', () => {
      test('makes the equivalent service API request and returns the response', async () => {
        // Create a request for the Node API
        const req = createRequest({
          method: 'post',
          headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
          query: {
            path: ['repairs'], // replicates how Next JS structures API requests
          },
          body: 'a body value',
        })

        const res = createResponse()

        // Mock the return value from the service API
        axios.mockImplementationOnce(() =>
          Promise.resolve({
            status: 200,
            data: {},
          })
        )

        // Call the Node API catch-all endpoint function
        await catchAllEndpoint(req, res)

        // Expect an almost-identical call to the service API from our Node API
        expect(axios).toHaveBeenCalledTimes(1)
        expect(axios).toHaveBeenCalledWith({
          method: 'post',
          headers,
          url: `${REPAIRS_SERVICE_API_URL}/repairs`,
          params: {},
          data: 'a body value',
        })

        // Expect the Node API response to reflect the service API response
        expect(res._getStatusCode()).toBe(200)
      })
    })
  })
})
