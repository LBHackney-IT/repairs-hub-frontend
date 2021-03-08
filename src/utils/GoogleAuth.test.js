import { isAuthorised } from './GoogleAuth'
import jsonwebtoken from 'jsonwebtoken'
import { createRequest, createResponse } from 'node-mocks-http'

const {
  AGENTS_GOOGLE_GROUPNAME,
  HACKNEY_JWT_SECRET,
  GSSO_TOKEN_NAME,
} = process.env

describe('isAuthorised', () => {
  describe('when the request contains a JWT signed with the known secret', () => {
    const signedCookie = jsonwebtoken.sign(
      {
        name: 'name',
        email: 'name@example.com',
        groups: [AGENTS_GOOGLE_GROUPNAME],
      },
      HACKNEY_JWT_SECRET
    )

    const req = createRequest({
      headers: { Cookie: `${GSSO_TOKEN_NAME}=${signedCookie};` },
    })

    const res = createResponse()

    test('returns a user object with relevant fields and permissions', () => {
      const user = isAuthorised({ req, res })

      expect(user).toMatchObject({
        name: 'name',
        email: 'name@example.com',
        hasAgentPermissions: true,
        hasContractorPermissions: false,
        hasAnyPermissions: true,
      })
    })
  })
})
