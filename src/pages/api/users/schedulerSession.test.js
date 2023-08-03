import jsonwebtoken from 'jsonwebtoken'
import { createRequest, createResponse } from 'node-mocks-http'
import { soapRequest } from '@/utils/soapRequestClient'

jest.mock('@/utils/soapRequestClient')

import schedulerSessionEndpoint from './schedulerSession'

const { HACKNEY_JWT_SECRET, GSSO_TOKEN_NAME, AGENTS_GOOGLE_GROUPNAME } =
  process.env

describe('GET /api/users/schedulerSession', () => {
  const signedCookie = jsonwebtoken.sign(
    {
      name: 'name',
      email: 'name@example.com',
      groups: [AGENTS_GOOGLE_GROUPNAME],
    },
    HACKNEY_JWT_SECRET
  )

  test('it returns a session ID following a successful response from DRS', async () => {
    const req = createRequest({
      method: 'get',
      headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
      query: {
        path: ['users', 'schedulerSession'],
      },
    })
    const res = createResponse()

    soapRequest.mockResolvedValueOnce({
      response: {
        statusCode: 200,
        body: `
              <soap:Envelope>
                <soap:Body>
                  <ns1:openSessionResponse>
                    <return>
                      <id>0</id>
                      <status>success</status>
                      <sessionId>MOCKED_DRS_SESSION_ID</sessionId>
                    </return>
                  </ns1:openSessionResponse>
                </soap:Body>
              </soap:Envelope>
            `,
      },
    })

    await schedulerSessionEndpoint(req, res)

    expect(soapRequest).toHaveBeenCalledTimes(1)

    const data = JSON.parse(res._getData())
    expect(data.schedulerSessionId).toEqual('MOCKED_DRS_SESSION_ID')
  })

  test('returns a matching response status with an error description', async () => {
    const req = createRequest({
      method: 'get',
      headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
      query: {
        path: ['users', 'schedulerSession'],
      },
    })

    const res = createResponse()

    soapRequest.mockResolvedValueOnce({
      response: {
        statusCode: 500,
        body: 'DRS error message',
      },
    })

    await schedulerSessionEndpoint(req, res)

    expect(soapRequest).toHaveBeenCalledTimes(1)

    expect(res._getStatusCode()).toEqual(500)

    expect(JSON.parse(res._getData()).message).toContain('DRS error message')
  })
})
