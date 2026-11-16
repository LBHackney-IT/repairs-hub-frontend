/** @jest-environment node */
import axios from 'axios'
import { authorisedRouteRequest, TEST_GROUPS } from 'factories/api_route'
import { paramsSerializer } from '@/utils/urls'

import contactDetailsEndpoint from './index'

jest.mock('axios')

const mockAxios = (axios as unknown) as jest.Mock

const { REPAIRS_SERVICE_API_URL } = process.env

const TENURE_ID = '250af5a91f04316aac4a7a737e98874'

const CONTACT_DETAILS = [
  { fullName: 'FirstName LastName', phoneNumbers: ['0123456789'] },
  { fullName: 'FirstName LastName', phoneNumbers: ['0123456789'] },
]

describe('GET /api/contact-details/[id] contact information redaction', () => {
  beforeEach(() => {
    mockAxios.mockResolvedValueOnce({ status: 200, data: CONTACT_DETAILS })
  })

  afterEach(() => {
    mockAxios.mockReset()
  })

  it.each([
    ['an agent', TEST_GROUPS.agent],
    ['an authorisation manager', TEST_GROUPS.authorisationManager],
  ])(
    'the response can include full contact information for %s',
    async (_role, group) => {
      const { req, res, upstreamHeaders } = await authorisedRouteRequest(
        { method: 'GET', query: { id: TENURE_ID } },
        group
      )

      await contactDetailsEndpoint(req, res)

      expect(mockAxios).toHaveBeenCalledTimes(1)
      expect(mockAxios).toHaveBeenCalledWith({
        method: 'GET',
        headers: upstreamHeaders,
        url: `${REPAIRS_SERVICE_API_URL}/contact-details/${TENURE_ID}`,
        params: {},
        paramsSerializer,
        data: {},
      })
      expect(JSON.parse(res._getData())).toEqual(CONTACT_DETAILS)
    }
  )

  it('redacts contact information for a contractor, without calling the service API', async () => {
    const { req, res } = await authorisedRouteRequest(
      { method: 'GET', query: { id: TENURE_ID } },
      TEST_GROUPS.contractor
    )

    await contactDetailsEndpoint(req, res)

    expect(mockAxios).not.toHaveBeenCalled()
    expect(JSON.parse(res._getData())).toEqual(['REMOVED'])
  })
})
