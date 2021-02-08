import MyApp from '../src/pages/_app'
import { AGENT_ROLE, CONTRACTOR_ROLE } from '../src/utils/user'

import { createRequest, createResponse } from 'node-mocks-http'
import jsonwebtoken from 'jsonwebtoken'
import * as HttpStatus from 'http-status-codes'

const {
  REPAIRS_AGENTS_GOOGLE_GROUPNAME,
  HACKNEY_JWT_SECRET,
  GSSO_TOKEN_NAME,
} = process.env

describe('MyApp.getInitialProps', () => {
  describe('when the context contains a valid user token', () => {
    const signedCookie = jsonwebtoken.sign(
      {
        name: 'name',
        email: 'name@example.com',
        groups: [REPAIRS_AGENTS_GOOGLE_GROUPNAME],
      },
      HACKNEY_JWT_SECRET
    )

    const headers = { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` }

    describe('when the component permittedRoles contains a role matching the user role', () => {
      const req = createRequest({ headers })
      const res = createResponse()

      const context = {
        req,
        res,
        pathname: '',
      }

      const component = {
        permittedRoles: [AGENT_ROLE], // matches the detected user role from their token
      }

      it('returns an object representing the user', async () => {
        const { userDetails } = await MyApp.getInitialProps({
          ctx: context,
          Component: component,
        })

        expect(userDetails).toMatchObject({
          name: 'name',
          email: 'name@example.com',
          hasAgentPermissions: true,
          hasContractorPermissions: false,
          hasAnyPermissions: true,
        })
      })
    })

    describe('when the component permittedRoles does not contain a role matching the user role', () => {
      const req = createRequest({ headers })
      const res = createResponse()

      const context = {
        req,
        res,
        pathname: '',
      }

      const component = {
        permittedRoles: [CONTRACTOR_ROLE], // does not match the user role from their token
      }

      it('returns an empty object and writes a redirect to the access denied page', async () => {
        const result = await MyApp.getInitialProps({
          ctx: context,
          Component: component,
        })

        expect(result).toEqual({})

        expect(res._getStatusCode()).toBe(HttpStatus.MOVED_TEMPORARILY)
        expect(res._getHeaders()).toEqual({ location: '/access-denied' })
      })
    })

    describe('when the component contains no permittedRoles', () => {
      const req = createRequest({ headers })
      const res = createResponse()

      const context = {
        req,
        res,
        pathname: '',
      }

      const component = {}

      it('returns an empty object and writes a redirect to the access denied page', async () => {
        const result = await MyApp.getInitialProps({
          ctx: context,
          Component: component,
        })

        expect(result).toEqual({})

        expect(res._getStatusCode()).toBe(HttpStatus.MOVED_TEMPORARILY)
        expect(res._getHeaders()).toEqual({ location: '/access-denied' })
      })
    })
  })
})
