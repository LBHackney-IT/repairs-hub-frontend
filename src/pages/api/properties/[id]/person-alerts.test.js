import axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import * as HttpStatus from 'http-status-codes'
import { createRequest, createResponse } from 'node-mocks-http'
import { paramsSerializer } from '@/utils/urls'

import personAlertsEndpoint from './person-alerts.js'

jest.mock('axios')

const {
  REPAIRS_SERVICE_API_URL,
  REPAIRS_SERVICE_API_KEY,
  HACKNEY_JWT_SECRET,
  GSSO_TOKEN_NAME,
  AGENTS_GOOGLE_GROUPNAME,
} = process.env

describe('/api/properties/[tenureId]/person-alerts', () => {
  test('returns a not authorised error when there is no auth cookie', async () => {
    const req = createRequest()
    const res = createResponse()

    await personAlertsEndpoint(req, res)

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
      'x-api-key': REPAIRS_SERVICE_API_KEY,
      'x-hackney-user': signedCookie,
      Authorization: signedCookie,
    }

    describe('a GET request', () => {
      test('makes the equivalent service API request with the id remaining URI-encoded and returns the response', async () => {
        const tenureId = 'b33dc0d3-4acf-4173-98fc-60742a793ca7'
        const req = createRequest({
          method: 'get',
          headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
          query: {
            path: ['properties', 'person-alerts'],
            id: tenureId,
          },
        })

        const res = createResponse()

        axios.create = jest.fn(() => axios)

        axios.mockImplementationOnce(() =>
          Promise.resolve({
            status: 200,
          })
        )

        await personAlertsEndpoint(req, res)

        expect(axios).toHaveBeenCalledTimes(1)
        expect(axios).toHaveBeenCalledWith({
          method: 'get',
          headers,
          url: `${REPAIRS_SERVICE_API_URL}/properties/${tenureId}/person-alerts`,
          params: {},
          paramsSerializer,
          data: {},
        })

        expect(res._getStatusCode()).toBe(200)
      })
    })
  })
})
