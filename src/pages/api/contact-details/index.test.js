import axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createRequest, createResponse } from 'node-mocks-http'
import { paramsSerializer } from '@/utils/urls'

import contactDetailsEndpoint from './index.js'

jest.mock('axios')

const {
  HACKNEY_JWT_SECRET,
  GSSO_TOKEN_NAME,
  REPAIRS_SERVICE_API_KEY,
  AGENTS_GOOGLE_GROUPNAME,
} = process.env

const CONTACT_DETAILS_API_URL = 'https://test.com/development'
process.env.CONTACT_DETAILS_API_URL = CONTACT_DETAILS_API_URL

describe('/api/contact-details', () => {
  beforeEach(() => {
    axios.create = jest.fn(() => axios)

    axios.mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
      })
    )
  })

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

  test('DELETE request forwards request to correct endpoint', async () => {
    const contactId = 'aaa'
    const personId = 'bbb'

    const req = createRequest({
      method: 'DELETE',
      headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
      query: {
        personId,
        contactId,
      },
    })

    const res = createResponse()

    await contactDetailsEndpoint(req, res)

    expect(axios).toHaveBeenCalledTimes(1)
    expect(axios).toHaveBeenCalledWith({
      method: 'DELETE',
      headers,
      url: `${CONTACT_DETAILS_API_URL}/api/v1/contactDetails`,
      params: {
        id: contactId,
        targetId: personId,
      },
      paramsSerializer,
      data: {},
    })
  })

  test('PATCH request forwards request to correct endpoint', async () => {
    const contactId = 'aaa'
    const personId = 'bbb'

    const req = createRequest({
      method: 'PATCH',
      headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
      query: {
        personId,
        contactId,
      },
    })

    const res = createResponse()

    await contactDetailsEndpoint(req, res)

    expect(axios).toHaveBeenCalledTimes(1)
    expect(axios).toHaveBeenCalledWith({
      method: 'PATCH',
      headers,
      url: `${CONTACT_DETAILS_API_URL}/api/v2/contactDetails/${contactId}/person/${personId}`,
      params: {},
      paramsSerializer,
      data: {},
    })
  })
})
