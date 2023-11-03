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
  CONTACT_DETAILS_API_URL,
} = process.env

// const TENURE_ID = '250af5a91f04316aac4a7a737e98874'

// const CONTACT_DETAILS = [
//   {
//     fullName: 'FirstName LastName',
//     phoneNumbers: ['0123456789', '0123456789'],
//   },
//   {
//     fullName: 'FirstName LastName',
//     phoneNumbers: ['0123456789', '0123456789'],
//   },
// ]

describe('/api/contact-details', () => {
  beforeEach(() => {
    axios.create = jest.fn(() => axios)

    axios.mockImplementationOnce(() =>
      Promise.resolve({
        status: 200,
        // data: CONTACT_DETAILS,
      })
    )
  })

  // DELETE request forwards request to correct endpoint
  // PATCH request forwards request to correct endpoint

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
    const personId = 'aaa'

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

    // CONTACT_DETAILS_API_URL
    expect(axios).toHaveBeenCalledTimes(1)
    expect(axios).toHaveBeenCalledWith({
      method: 'DELETE',
      headers,
      url: `${CONTACT_DETAILS_API_URL}/api/v2/contactDetails/${contactId}/person/${personId}`,
      params: {},
      paramsSerializer,
      data: {},
    })

    //       const req = createRequest({
    //         method: 'get',
    //         headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
    //         query: {
    //           id: TENURE_ID,
    //         },
    //         params: {},
    //       })

    //       const res = createResponse()

    //       await contactDetailsEndpoint(req, res)

    //       // ["REMOVED"] is returned before API call if user doesn't have valid permissions
    //       expect(axios).toHaveBeenCalledTimes(0)

    //       const parsedData = JSON.parse(res._getData())

    //       expect(parsedData).toEqual(['REMOVED'])
  })
})

// describe('GET /api/contact-details/[id] contact information redaction', () => {
//   beforeEach(() => {
//     axios.create = jest.fn(() => axios)

//     axios.mockImplementationOnce(() =>
//       Promise.resolve({
//         status: 200,
//         data: CONTACT_DETAILS,
//       })
//     )
//   })

//   describe('when the cookie is for an agent', () => {
//     const signedCookie = jsonwebtoken.sign(
//       {
//         name: 'name',
//         email: 'name@example.com',
//         groups: [AGENTS_GOOGLE_GROUPNAME],
//       },
//       HACKNEY_JWT_SECRET
//     )

//     const headers = {
//       'Content-Type': 'application/json',
//       'x-api-key': REPAIRS_SERVICE_API_KEY,
//       'x-hackney-user': signedCookie,
//       Authorization: signedCookie,
//     }

//     test('the response can include full contact information', async () => {
//       const req = createRequest({
//         method: 'get',
//         headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
//         query: {
//           id: TENURE_ID,
//         },
//         params: {},
//       })

//       const res = createResponse()

//       await contactDetailsEndpoint(req, res)

//       expect(axios).toHaveBeenCalledTimes(1)
//       expect(axios).toHaveBeenCalledWith({
//         method: 'get',
//         headers,
//         url: `${REPAIRS_SERVICE_API_URL}/contact-details/${TENURE_ID}`,
//         params: {},
//         paramsSerializer,
//         data: {},
//       })

//       const parsedData = JSON.parse(res._getData())

//       expect(parsedData).toEqual(CONTACT_DETAILS)
//     })
//   })

//   describe('when the cookie is for an authorisation manager', () => {
//     const signedCookie = jsonwebtoken.sign(
//       {
//         name: 'name',
//         email: 'name@example.com',
//         groups: [AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME],
//       },
//       HACKNEY_JWT_SECRET
//     )

//     const headers = {
//       'Content-Type': 'application/json',
//       'x-api-key': REPAIRS_SERVICE_API_KEY,
//       'x-hackney-user': signedCookie,
//       Authorization: signedCookie,
//     }

//     test('the response can include full contact information', async () => {
//       const req = createRequest({
//         method: 'get',
//         headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
//         query: {
//           id: TENURE_ID,
//         },
//         params: {},
//       })

//       const res = createResponse()

//       await contactDetailsEndpoint(req, res)

//       expect(axios).toHaveBeenCalledTimes(1)
//       expect(axios).toHaveBeenCalledWith({
//         method: 'get',
//         headers,
//         url: `${REPAIRS_SERVICE_API_URL}/contact-details/${TENURE_ID}`,
//         params: {},
//         paramsSerializer,
//         data: {},
//       })

//       const parsedData = JSON.parse(res._getData())

//       expect(parsedData).toEqual(CONTACT_DETAILS)
//     })
//   })

//   describe('when the cookie is for a contractor', () => {
//     const signedCookie = jsonwebtoken.sign(
//       {
//         name: 'name',
//         email: 'name@example.com',
//         groups: [CONTRACTORS_GOOGLE_GROUPNAME],
//       },
//       HACKNEY_JWT_SECRET
//     )

//     test('response contact information is redacted', async () => {
//       const req = createRequest({
//         method: 'get',
//         headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
//         query: {
//           id: TENURE_ID,
//         },
//         params: {},
//       })

//       const res = createResponse()

//       await contactDetailsEndpoint(req, res)

//       // ["REMOVED"] is returned before API call if user doesn't have valid permissions
//       expect(axios).toHaveBeenCalledTimes(0)

//       const parsedData = JSON.parse(res._getData())

//       expect(parsedData).toEqual(['REMOVED'])
//     })
//   })
// })
