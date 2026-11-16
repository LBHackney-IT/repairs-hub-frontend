/** @jest-environment node */
import { makeIdToken } from 'factories/session_cookie'
import { authOptions } from './authOptions'

const { jwt, session, redirect } = authOptions.callbacks
const { logger } = authOptions

describe('authOptions', () => {
  describe('jwt callback', () => {
    const signIn = ({
      claims = {},
      profile = undefined,
      account = { id_token: makeIdToken(claims) },
    }: {
      claims?: Record<string, unknown>
      profile?: Record<string, unknown>
      account?: Record<string, unknown>
    } = {}) => jwt({ token: {}, account, profile } as never)

    it('stores the id token, expiry, sub, identity and groups on sign-in', async () => {
      const idToken = makeIdToken({
        sub: 'user-sub',
        exp: 1900000000,
        email: 'claims@example.com',
        name: 'Claims Name',
        'custom:groups': ['group-a', 'group-b'],
      })

      const token = await signIn({ account: { id_token: idToken } })

      expect(token).toEqual({
        cognitoIdToken: idToken,
        cognitoTokenExpiresAt: 1900000000,
        cognitoSub: 'user-sub',
        email: 'claims@example.com',
        name: 'Claims Name',
        groups: ['group-a', 'group-b'],
      })
    })

    it('prefers the id token claims over the profile for email and name', async () => {
      const token = await signIn({
        claims: { email: 'claims@example.com', name: 'Claims Name' },
        profile: { email: 'profile@example.com', name: 'Profile Name' },
      })

      expect(token).toMatchObject({
        email: 'claims@example.com',
        name: 'Claims Name',
      })
    })

    it('falls back to the profile when the claims have no email or name', async () => {
      const token = await signIn({
        profile: { email: 'profile@example.com', name: 'Profile Name' },
      })

      expect(token).toMatchObject({
        email: 'profile@example.com',
        name: 'Profile Name',
      })
    })

    it('parses a groups string from the claims', async () => {
      const token = await signIn({
        claims: { 'custom:groups': 'group-a, group-b' },
      })

      expect(token.groups).toEqual(['group-a', 'group-b'])
    })

    it('falls back to the profile groups when the claims have none', async () => {
      const token = await signIn({
        profile: { 'custom:groups': ['profile-group'] },
      })

      expect(token.groups).toEqual(['profile-group'])
    })

    it('returns the token unchanged when there is no account (not a sign-in)', async () => {
      const existing = {
        cognitoIdToken: 'existing-id-token',
        cognitoSub: 'existing-sub',
        groups: ['group-a'],
      }

      const token = await jwt({ token: existing } as never)

      expect(token).toEqual(existing)
    })

    describe('fails the sign-in', () => {
      it('when the account has no id token', async () => {
        await expect(signIn({ account: {} })).rejects.toThrow(
          'Cognito response did not contain a valid ID token'
        )
      })

      it('when the id token has no sub', async () => {
        await expect(signIn({ claims: { sub: undefined } })).rejects.toThrow(
          'Cognito response did not contain a valid ID token'
        )
      })

      it('when the id token has no exp', async () => {
        await expect(signIn({ claims: { exp: undefined } })).rejects.toThrow(
          'Cognito response did not contain a valid ID token'
        )
      })

      it('when the id token cannot be parsed', async () => {
        await expect(
          signIn({ account: { id_token: 'not-a-token' } })
        ).rejects.toThrow('Cognito response did not contain a valid ID token')
      })
    })
  })

  describe('session callback', () => {
    const token = {
      cognitoSub: 'user-sub',
      cognitoIdToken: 'SECRET-ID-TOKEN',
      groups: ['group-a'],
      email: 'name@example.com',
    }

    it('exposes only the user id and groups', async () => {
      const result = await session({
        session: { user: { name: 'Name', email: 'name@example.com' } },
        token,
      } as never)

      expect(result.user).toEqual({
        name: 'Name',
        email: 'name@example.com',
        id: 'user-sub',
        groups: ['group-a'],
      })
    })

    it('never exposes the Cognito id token to the browser', async () => {
      const result = await session({
        session: { user: { name: 'Name' } },
        token,
      } as never)

      expect(JSON.stringify(result)).not.toContain('SECRET-ID-TOKEN')
    })

    it('does not throw when the session has no user', async () => {
      const result = await session({ session: {}, token } as never)

      expect(result).toEqual({})
    })
  })

  describe('redirect callback', () => {
    const baseUrl = 'https://app.example.com'

    it('keeps a relative path on this site', async () => {
      expect(await redirect({ url: '/work-orders', baseUrl })).toBe(
        'https://app.example.com/work-orders'
      )
    })

    it('allows an absolute URL on this origin', async () => {
      const url = 'https://app.example.com/work-orders?a=1'

      expect(await redirect({ url, baseUrl })).toBe(url)
    })

    it.each([
      ['another host', 'https://evil.example.com/phish'],
      ['another scheme', 'http://app.example.com/work-orders'],
      ['another port', 'https://app.example.com:8443/work-orders'],
    ])('sends %s to the home page', async (_, url) => {
      expect(await redirect({ url, baseUrl })).toBe(baseUrl)
    })

    it('sends an invalid URL to the home page', async () => {
      expect(await redirect({ url: 'not a url', baseUrl })).toBe(baseUrl)
    })

    it('keeps a protocol-relative URL on this site by prefixing the base URL', async () => {
      expect(await redirect({ url: '//evil.example.com', baseUrl })).toBe(
        'https://app.example.com//evil.example.com'
      )
    })
  })

  describe('logger', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    const logError = (code: string, metadata: unknown) => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

      logger.error(code as never, metadata as never)

      return spy
    }

    it('logs the error name and message and the provider', () => {
      const spy = logError('OAUTH_CALLBACK_ERROR', {
        error: new Error('boom'),
        providerId: 'cognito',
      })

      expect(spy).toHaveBeenCalledWith(
        'NextAuth error OAUTH_CALLBACK_ERROR',
        'Error: boom | provider=cognito'
      )
    })

    it('logs the oauth error and description from the cause', () => {
      const cause = Object.assign(new Error('failed'), {
        error: 'invalid_client',
        error_description: 'bad client secret',
      })

      const spy = logError('OAUTH_CALLBACK_ERROR', { error: cause })

      expect(spy).toHaveBeenCalledWith(
        'NextAuth error OAUTH_CALLBACK_ERROR',
        'Error: failed | oauth_error=invalid_client | oauth_error_description=bad client secret'
      )
    })

    it('prefers a description on the metadata over one on the cause', () => {
      const spy = logError('OAUTH_CALLBACK_ERROR', {
        error: Object.assign(new Error('failed'), {
          error_description: 'from cause',
        }),
        error_description: 'from metadata',
      })

      expect(spy.mock.calls[0][1]).toContain(
        'oauth_error_description=from metadata'
      )
    })

    it('handles metadata that is itself an Error', () => {
      const spy = logError('SIGNIN_ERROR', new Error('direct'))

      expect(spy).toHaveBeenCalledWith(
        'NextAuth error SIGNIN_ERROR',
        'Error: direct'
      )
    })

    it.each([undefined, null, 'a string'])(
      'does not throw when the metadata is %p',
      (metadata) => {
        const spy = logError('SIGNIN_ERROR', metadata)

        expect(spy).toHaveBeenCalledTimes(1)
      }
    )

    it('never logs tokens or profile data from the metadata', () => {
      const spy = logError('OAUTH_CALLBACK_ERROR', {
        error: new Error('failed'),
        providerId: 'cognito',
        id_token: 'SECRET-ID-TOKEN',
        access_token: 'SECRET-ACCESS-TOKEN',
        profile: { email: 'private@example.com' },
      })

      const logged = JSON.stringify(spy.mock.calls)

      expect(logged).not.toContain('SECRET')
      expect(logged).not.toContain('private@example.com')
    })

    it('logs only the code for warnings', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})

      logger.warn('NEXTAUTH_URL' as never)

      expect(spy).toHaveBeenCalledWith('NextAuth warning NEXTAUTH_URL')
    })

    it('does not log debug messages', () => {
      const spies = (['log', 'debug', 'info'] as const).map((method) =>
        jest.spyOn(console, method).mockImplementation(() => {})
      )

      logger.debug('SOME_DEBUG', { id_token: 'SECRET' })

      spies.forEach((spy) => expect(spy).not.toHaveBeenCalled())
    })
  })
})
