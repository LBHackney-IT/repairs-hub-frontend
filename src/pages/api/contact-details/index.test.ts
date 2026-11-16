/** @jest-environment node */
import axios from 'axios'
import { authorisedRouteRequest } from 'factories/api_route'
import { paramsSerializer } from '@/utils/urls'

import contactDetailsEndpoint from './index'

jest.mock('axios')

const mockAxios = (axios as unknown) as jest.Mock

const CONTACT_DETAILS_API_URL = 'https://test.com/development'
const CONTACT_ID = 'aaa'
const PERSON_ID = 'bbb'

describe('/api/contact-details', () => {
  beforeAll(() => {
    process.env.CONTACT_DETAILS_API_URL = CONTACT_DETAILS_API_URL
  })

  beforeEach(() => {
    mockAxios.mockResolvedValueOnce({ status: 200 })
  })

  afterEach(() => {
    mockAxios.mockReset()
  })

  it('DELETE request forwards request to correct endpoint', async () => {
    const { req, res, upstreamHeaders } = await authorisedRouteRequest({
      method: 'DELETE',
      query: { personId: PERSON_ID, contactId: CONTACT_ID },
    })

    await contactDetailsEndpoint(req, res)

    expect(mockAxios).toHaveBeenCalledTimes(1)
    expect(mockAxios).toHaveBeenCalledWith({
      method: 'DELETE',
      headers: upstreamHeaders,
      url: `${CONTACT_DETAILS_API_URL}/api/v1/contactDetails`,
      params: { id: CONTACT_ID, targetId: PERSON_ID },
      paramsSerializer,
      data: {},
    })
  })

  it('PATCH request forwards request to correct endpoint', async () => {
    const { req, res, upstreamHeaders } = await authorisedRouteRequest({
      method: 'PATCH',
      query: { personId: PERSON_ID, contactId: CONTACT_ID },
    })

    await contactDetailsEndpoint(req, res)

    expect(mockAxios).toHaveBeenCalledTimes(1)
    expect(mockAxios).toHaveBeenCalledWith({
      method: 'PATCH',
      headers: upstreamHeaders,
      url: `${CONTACT_DETAILS_API_URL}/api/v2/contactDetails/${CONTACT_ID}/person/${PERSON_ID}`,
      params: {},
      paramsSerializer,
      data: {},
    })
  })
})
