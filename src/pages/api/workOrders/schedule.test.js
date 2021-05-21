import axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createRequest, createResponse } from 'node-mocks-http'
import { paramsSerializer } from '../../../utils/urls'

import scheduleEndpoint from './schedule.js'

jest.mock('axios')

const {
  REPAIRS_SERVICE_API_URL,
  REPAIRS_SERVICE_API_KEY,
  HACKNEY_JWT_SECRET,
  AGENTS_GOOGLE_GROUPNAME,
  GSSO_TOKEN_NAME,
} = process.env

describe('/api/workOrders/schedule', () => {
  // Signed JWT for auth
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
  }

  describe('a POST request', () => {
    test('makes the equivalent service API request and returns the response', async () => {
      const req = createRequest({
        method: 'post',
        headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
        query: {
          path: ['workOrders'],
        },
        body: 'a body value',
      })

      const res = createResponse()

      axios.create = jest.fn(() => axios)

      axios.mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          data: {},
        })
      )

      await scheduleEndpoint(req, res)

      expect(axios).toHaveBeenCalledTimes(1)

      expect(axios).toHaveBeenCalledWith({
        method: 'post',
        headers,
        url: `${REPAIRS_SERVICE_API_URL}/workOrders/schedule`,
        params: {},
        paramsSerializer: paramsSerializer,
        data: 'a body value',
      })

      expect(res._getStatusCode()).toBe(200)
    })
  })
})
