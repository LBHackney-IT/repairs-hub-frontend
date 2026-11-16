/** @jest-environment node */
import axios from 'axios'
import { authorisedRouteRequest, TEST_GROUPS } from 'factories/api_route'
import { paramsSerializer } from '@/utils/urls'

import propertiesEndpoint from './index'

jest.mock('axios')

const mockAxios = (axios as unknown) as jest.Mock

const { REPAIRS_SERVICE_API_URL } = process.env

const CONTACT_DETAILS = [
  { fullName: 'FirstName LastName', phoneNumbers: ['0123456789'] },
  { fullName: 'FirstName LastName', phoneNumbers: ['0123456789'] },
]

describe('GET /api/properties/[id] contact information redaction', () => {
  beforeEach(() => {
    mockAxios.mockResolvedValueOnce({
      status: 200,
      data: {
        property: {},
        alerts: {},
        tenure: {},
        contactDetails: CONTACT_DETAILS,
      },
    })
  })

  afterEach(() => {
    mockAxios.mockReset()
  })

  const getProperty = async (group: string) => {
    const route = await authorisedRouteRequest(
      { method: 'GET', query: { id: '1' } },
      group
    )

    await propertiesEndpoint(route.req, route.res)

    return route
  }

  it.each([
    ['an agent', TEST_GROUPS.agent],
    ['an authorisation manager', TEST_GROUPS.authorisationManager],
  ])(
    'the response can include full contact information for %s',
    async (_role, group) => {
      const { res, upstreamHeaders } = await getProperty(group)

      expect(mockAxios).toHaveBeenCalledWith({
        method: 'GET',
        headers: upstreamHeaders,
        url: `${REPAIRS_SERVICE_API_URL}/properties/1`,
        params: {},
        paramsSerializer,
        data: {},
      })
      expect(JSON.parse(res._getData()).contactDetails).toEqual(CONTACT_DETAILS)
    }
  )

  it('redacts contact information for a contractor', async () => {
    const { res } = await getProperty(TEST_GROUPS.contractor)

    expect(mockAxios).toHaveBeenCalledTimes(1)
    expect(JSON.parse(res._getData()).contactDetails).toEqual(['REMOVED'])
  })
})
