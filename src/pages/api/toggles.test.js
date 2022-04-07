import axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import * as HttpStatus from 'http-status-codes'
import { createRequest, createResponse } from 'node-mocks-http'

import togglesEndpoint from './toggles'

jest.mock('axios')

const {
  CONFIGURATION_API_URL,
  HACKNEY_JWT_SECRET,
  GSSO_TOKEN_NAME,
  AGENTS_GOOGLE_GROUPNAME,
} = process.env

describe('/api/toggles', () => {
  test('returns a not authorised error when there is no auth cookie', async () => {
    const req = createRequest()
    const res = createResponse()

    await togglesEndpoint(req, res)

    expect(res._getStatusCode()).toBe(HttpStatus.UNAUTHORIZED)
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Auth cookie missing.',
    })
  })

  describe('when the request is authorised', () => {
    const signedCookie = jsonwebtoken.sign(
      {
        name: 'name',
        email: 'name@example.com',
        groups: [AGENTS_GOOGLE_GROUPNAME],
      },
      HACKNEY_JWT_SECRET
    )

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${signedCookie}`,
    }

    describe('a GET request', () => {
      test('makes the configuration API request and returns the response', async () => {
        const req = createRequest({
          method: 'get',
          headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
          query: {
            path: ['toggles'],
          },
        })

        const res = createResponse()

        axios.create = jest.fn(() => axios)

        axios.mockImplementationOnce(() =>
          Promise.resolve({
            status: 200,
            data: { key: 'hackney' },
          })
        )

        await togglesEndpoint(req, res)

        expect(axios).toHaveBeenCalledTimes(1)
        expect(axios).toHaveBeenCalledWith({
          method: 'get',
          headers,
          url: `${CONFIGURATION_API_URL}/api/v1/configuration`,
          params: { types: 'RH' },
        })

        expect(res._getStatusCode()).toBe(200)
        expect(JSON.parse(res._getData())).toEqual({ key: 'hackney' })
      })
    })
  })
})
