import axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createRequest, createResponse } from 'node-mocks-http'

import repairsEndpoint from './repairs.js'

jest.mock('axios', () => jest.fn())

const {
  REPAIRS_SERVICE_API_URL,
  REPAIRS_SERVICE_API_KEY,
  HACKNEY_JWT_SECRET,
  GSSO_TOKEN_NAME,
  CONTRACTORS_ALPHATRACK_GOOGLE_GROUPNAME,
} = process.env

describe('GET /api/repairs', () => {
  const signedCookie = jsonwebtoken.sign(
    {
      name: 'name',
      email: 'name@example.com',
      groups: [CONTRACTORS_ALPHATRACK_GOOGLE_GROUPNAME], // mapped internally to the 'H01' contractor Ref
    },
    HACKNEY_JWT_SECRET
  )

  const headers = {
    'x-api-key': REPAIRS_SERVICE_API_KEY,
    'x-hackney-user': signedCookie,
  }

  describe("when called from a contractor's browser with a reference that doesn't apply to me", () => {
    test('it always applies my contratorReference mapped from the user token', async () => {
      const req = createRequest({
        method: 'get',
        headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
        query: {
          path: ['repairs'],
          ContractorReference: 'give-me-unauthorised-results', // simulate a user forcing another ref
        },
      })

      axios.mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
        })
      )

      const res = createResponse()

      await repairsEndpoint(req, res)

      expect(axios).toHaveBeenCalledTimes(1)
      expect(axios).toHaveBeenCalledWith({
        method: 'get',
        headers,
        url: `${REPAIRS_SERVICE_API_URL}/repairs`,
        params: { ContractorReference: 'H01' }, // request to service API made with user's contractor ref from cookie
        data: {},
      })
    })
  })
})
