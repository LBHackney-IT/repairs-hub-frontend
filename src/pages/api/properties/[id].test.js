import axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createRequest, createResponse } from 'node-mocks-http'
import { paramsSerializer } from '@/utils/urls'

import propertiesEndpoint from './[id].js'

jest.mock('axios')

const {
  REPAIRS_SERVICE_API_URL,
  HACKNEY_JWT_SECRET,
  GSSO_TOKEN_NAME,
  REPAIRS_SERVICE_API_KEY,
  AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME,
  AGENTS_GOOGLE_GROUPNAME,
  CONTRACTORS_GOOGLE_GROUPNAME,
} = process.env

describe('GET /api/properties/[id] contact information redaction', () => {
  beforeEach(() => {
    axios.create = jest.fn(() => axios)

    axios.mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        data: {
          property: {},
          alerts: {},
          tenure: {},
          contacts: {
            contacts: [
              {
                firstName: 'FirstName',
                lastName: 'LastName',
                phoneNumbers: ['0123456789', '0123456789'],
              },
              {
                firstName: 'FirstName',
                lastName: 'LastName',
                phoneNumbers: ['0123456789', '0123456789'],
              },
            ],
          },
        },
      })
    )
  })

  describe('when the cookie is for an agent', () => {
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

    test('the response can include full contact information', async () => {
      const req = createRequest({
        method: 'get',
        headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
        query: {
          id: '1',
        },
        params: {},
      })

      const res = createResponse()

      await propertiesEndpoint(req, res)

      expect(axios).toHaveBeenCalledTimes(1)
      expect(axios).toHaveBeenCalledWith({
        method: 'get',
        headers,
        url: `${REPAIRS_SERVICE_API_URL}/properties/1`,
        params: {},
        paramsSerializer,
        data: {},
      })

      const parsedData = JSON.parse(res._getData())

      expect(parsedData['contacts']).toEqual({
        contacts: [
          {
            firstName: 'FirstName',
            lastName: 'LastName',
            phoneNumbers: ['0123456789', '0123456789'],
          },
          {
            firstName: 'FirstName',
            lastName: 'LastName',
            phoneNumbers: ['0123456789', '0123456789'],
          },
        ],
      })
    })
  })

  describe('when the cookie is for an authorisation manager', () => {
    const signedCookie = jsonwebtoken.sign(
      {
        name: 'name',
        email: 'name@example.com',
        groups: [AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME],
      },
      HACKNEY_JWT_SECRET
    )

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': REPAIRS_SERVICE_API_KEY,
      'x-hackney-user': signedCookie,
      Authorization: signedCookie,
    }

    test('the response can include full contact information', async () => {
      const req = createRequest({
        method: 'get',
        headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
        query: {
          id: '1',
        },
        params: {},
      })

      const res = createResponse()

      await propertiesEndpoint(req, res)

      expect(axios).toHaveBeenCalledTimes(1)
      expect(axios).toHaveBeenCalledWith({
        method: 'get',
        headers,
        url: `${REPAIRS_SERVICE_API_URL}/properties/1`,
        params: {},
        paramsSerializer,
        data: {},
      })

      const parsedData = JSON.parse(res._getData())

      expect(parsedData['contacts']).toEqual({
        contacts: [
          {
            firstName: 'FirstName',
            lastName: 'LastName',
            phoneNumbers: ['0123456789', '0123456789'],
          },
          {
            firstName: 'FirstName',
            lastName: 'LastName',
            phoneNumbers: ['0123456789', '0123456789'],
          },
        ],
      })
    })
  })

  describe('when the cookie is for a contractor', () => {
    const signedCookie = jsonwebtoken.sign(
      {
        name: 'name',
        email: 'name@example.com',
        groups: [CONTRACTORS_GOOGLE_GROUPNAME],
      },
      HACKNEY_JWT_SECRET
    )

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': REPAIRS_SERVICE_API_KEY,
      'x-hackney-user': signedCookie,
      Authorization: signedCookie,
    }

    test('response contact information is redacted', async () => {
      const req = createRequest({
        method: 'get',
        headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
        query: {
          id: '1',
        },
      })

      const res = createResponse()

      await propertiesEndpoint(req, res)

      expect(axios).toHaveBeenCalledTimes(1)
      expect(axios).toHaveBeenCalledWith({
        method: 'get',
        headers,
        url: `${REPAIRS_SERVICE_API_URL}/properties/1`,
        params: {},
        paramsSerializer,
        data: {},
      })

      const parsedData = JSON.parse(res._getData())

      expect(parsedData['contacts']).toEqual(['REMOVED'])
    })
  })
})
