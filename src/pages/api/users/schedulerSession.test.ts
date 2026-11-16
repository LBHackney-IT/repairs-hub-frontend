/** @jest-environment node */
import { soapRequest } from '@/utils/soapRequestClient'
import { authorisedRouteRequest } from 'factories/api_route'

jest.mock('@/utils/soapRequestClient')

import schedulerSessionEndpoint from './schedulerSession'

const mockSoapRequest = soapRequest as jest.Mock

describe('GET /api/users/schedulerSession', () => {
  beforeEach(() => {
    // the route logs DRS failures
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('returns a session ID following a successful response from DRS', async () => {
    const { req, res } = await authorisedRouteRequest({ method: 'GET' })

    mockSoapRequest.mockResolvedValueOnce({
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

    expect(mockSoapRequest).toHaveBeenCalledTimes(1)

    const data = JSON.parse(res._getData())
    expect(data.schedulerSessionId).toEqual('MOCKED_DRS_SESSION_ID')
  })

  it('returns a matching response status with an error description', async () => {
    const { req, res } = await authorisedRouteRequest({ method: 'GET' })

    mockSoapRequest.mockResolvedValueOnce({
      response: {
        statusCode: 500,
        body: 'DRS error message',
      },
    })

    await schedulerSessionEndpoint(req, res)

    expect(mockSoapRequest).toHaveBeenCalledTimes(1)

    expect(res._getStatusCode()).toEqual(500)

    expect(JSON.parse(res._getData()).message).toContain('DRS error message')
  })
})
