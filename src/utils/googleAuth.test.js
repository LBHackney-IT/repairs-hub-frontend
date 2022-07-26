import { isAuthorised, deleteSessions } from './googleAuth'
import jsonwebtoken from 'jsonwebtoken'
import { createRequest, createResponse } from 'node-mocks-http'

const { HACKNEY_JWT_SECRET, GSSO_TOKEN_NAME, AGENTS_GOOGLE_GROUPNAME } =
  process.env

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

describe('deleteSessions', () => {
  describe('expires the auth session along with other supplied sessions', () => {
    const res = createResponse()

    test('returns a user object with relevant fields and permissions', () => {
      deleteSessions(res, {
        additionalCookies: {
          'another-cookie': { domain: 'repairs-hub.hackney.gov.uk', path: '/' },
        },
      })

      expect(res.getHeaders()['set-cookie']).toContain(
        `${GSSO_TOKEN_NAME}=null; Max-Age=-1; Domain=localhost; Path=/`
      )

      expect(res.getHeaders()['set-cookie']).toContain(
        'another-cookie=null; Max-Age=-1; Domain=repairs-hub.hackney.gov.uk; Path=/'
      )
    })
  })
})
