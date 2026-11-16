/** @jest-environment node */
import type { IncomingMessage } from 'http'
import * as cookie from 'cookie'
import { createRequest } from 'node-mocks-http'
import { signSessionCookie } from 'factories/session_cookie'
import { getApiToken, getAuthenticatedUser, getAuthToken } from './auth'

const AGENT_GROUP = 'test-agents'
const OPERATIVE_GROUP = 'test-operatives'
const CONTRACTOR_GROUP = 'test-contractors-acme'

const nowInSeconds = () => Math.floor(Date.now() / 1000)

describe('auth', () => {
  const originalEnv = { ...process.env }

  beforeAll(() => {
    // buildUser reads these at call time. Set them here so the tests don't
    // depend on a developer's .env.test.local.
    process.env.AGENTS_GOOGLE_GROUPNAME_REGEX = `^${AGENT_GROUP}$`
    process.env.CONTRACTORS_GOOGLE_GROUPNAME_REGEX = '^test-contractors-'
    process.env.OPERATIVES_GOOGLE_GROUPNAME = OPERATIVE_GROUP
  })

  afterAll(() => {
    process.env = originalEnv
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const sessionRequest = async (
    options: Parameters<typeof signSessionCookie>[0] = {}
  ) => {
    const session = await signSessionCookie({
      groups: [AGENT_GROUP],
      ...options,
    })

    return { session, req: createRequest(session.requestOptions) }
  }

  // getToken reads the parsed `req.cookies`, so set both like Next does
  const requestWithCookie = (cookieHeader?: string) =>
    createRequest({
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
      cookies: cookie.parse(cookieHeader ?? ''),
    })

  describe('getAuthToken', () => {
    it('returns the token for a valid session cookie', async () => {
      const { session, req } = await sessionRequest({
        groups: [AGENT_GROUP, OPERATIVE_GROUP],
      })

      const token = await getAuthToken(req)

      expect(token).toMatchObject({
        cognitoIdToken: session.idToken,
        cognitoSub: 'cognito-sub',
        groups: [AGENT_GROUP, OPERATIVE_GROUP],
      })
    })

    it('returns null when there is no cookie', async () => {
      expect(await getAuthToken(requestWithCookie())).toBeNull()
    })

    it('returns null, without throwing, for a cookie encrypted with a different secret', async () => {
      const { req } = await sessionRequest({ secret: 'a-different-secret' })

      expect(await getAuthToken(req)).toBeNull()
    })

    it('returns null for a garbage cookie value', async () => {
      const req = requestWithCookie('next-auth.session-token=not-a-real-token')

      expect(await getAuthToken(req)).toBeNull()
    })

    it('returns null for a valid cookie with no Cognito id token', async () => {
      const { req } = await sessionRequest({ idToken: false })

      expect(await getAuthToken(req)).toBeNull()
    })

    it('reads the session from the plain request Next gives a page (IncomingMessage plus cookies)', async () => {
      const session = await signSessionCookie({ groups: [AGENT_GROUP] })
      const req = ({
        headers: { cookie: `${session.name}=${session.value}` },
        cookies: { [session.name]: session.value },
      } as unknown) as IncomingMessage

      expect(await getAuthToken(req)).toMatchObject({
        cognitoIdToken: session.idToken,
      })
    })

    describe('id token expiry', () => {
      it('returns the token while the id token is still valid', async () => {
        const exp = nowInSeconds() + 600
        const { req } = await sessionRequest({ exp })
        jest.spyOn(Date, 'now').mockReturnValue(exp * 1000 - 1)

        expect(await getAuthToken(req)).not.toBeNull()
      })

      it('returns null at the exact expiry time', async () => {
        const exp = nowInSeconds() + 600
        const { req } = await sessionRequest({ exp })
        jest.spyOn(Date, 'now').mockReturnValue(exp * 1000)

        expect(await getAuthToken(req)).toBeNull()
      })

      it('returns null once the id token has expired', async () => {
        const exp = nowInSeconds() + 600
        const { req } = await sessionRequest({ exp })
        jest.spyOn(Date, 'now').mockReturnValue(exp * 1000 + 60_000)

        expect(await getAuthToken(req)).toBeNull()
      })

      it('accepts a token that has no expiry recorded', async () => {
        // Sign-in always records the expiry, so this should not happen. It
        // documents that the expiry check is skipped when it is absent.
        const session = await signSessionCookie({ groups: [AGENT_GROUP] })
        const { encode, decode } = await import('next-auth/jwt')
        const secret = process.env.NEXTAUTH_SECRET
        const decoded = await decode({ token: session.value, secret })
        delete decoded.cognitoTokenExpiresAt
        const value = await encode({ token: decoded, secret })

        const token = await getAuthToken(
          requestWithCookie(`${session.name}=${value}`)
        )

        expect(token).toMatchObject({ cognitoIdToken: session.idToken })
      })
    })
  })

  describe('getAuthenticatedUser', () => {
    it('builds the user from a valid agent session', async () => {
      const { req } = await sessionRequest({
        name: 'Ada Agent',
        email: 'ada@example.com',
      })

      const user = await getAuthenticatedUser(req)

      expect(user).toMatchObject({
        name: 'Ada Agent',
        email: 'ada@example.com',
        roles: ['agent'],
        hasAgentPermissions: true,
        hasAnyPermissions: true,
      })
    })

    it('maps the session groups to roles', async () => {
      const { req } = await sessionRequest({
        groups: [OPERATIVE_GROUP, CONTRACTOR_GROUP],
      })

      const user = await getAuthenticatedUser(req)

      expect(user.roles.sort()).toEqual(['contractor', 'operative'])
    })

    it('returns null when there is no session', async () => {
      expect(await getAuthenticatedUser(requestWithCookie())).toBeNull()
    })

    it('returns null when the session has expired', async () => {
      const exp = nowInSeconds() + 600
      const { req } = await sessionRequest({ exp })
      jest.spyOn(Date, 'now').mockReturnValue(exp * 1000 + 60_000)

      expect(await getAuthenticatedUser(req)).toBeNull()
    })

    it('returns a user with no permissions when the session has no groups', async () => {
      const { req } = await sessionRequest({ groups: null })

      const user = await getAuthenticatedUser(req)

      expect(user).toMatchObject({ roles: [], hasAnyPermissions: false })
    })

    it('returns a user with no permissions when none of the groups are recognised', async () => {
      const { req } = await sessionRequest({ groups: ['some-other-group'] })

      const user = await getAuthenticatedUser(req)

      expect(user).toMatchObject({ roles: [], hasAnyPermissions: false })
    })
  })

  describe('getApiToken', () => {
    it('returns the Cognito id token, not the session cookie', async () => {
      const { session, req } = await sessionRequest()

      const token = await getApiToken(req)

      expect(token).toBe(session.idToken)
      expect(token).not.toBe(session.value)
    })

    it('returns undefined when there is no session', async () => {
      expect(await getApiToken(requestWithCookie())).toBeUndefined()
    })

    it('returns undefined when the session has expired', async () => {
      const exp = nowInSeconds() + 600
      const { req } = await sessionRequest({ exp })
      jest.spyOn(Date, 'now').mockReturnValue(exp * 1000 + 60_000)

      expect(await getApiToken(req)).toBeUndefined()
    })
  })
})
