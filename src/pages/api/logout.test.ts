/** @jest-environment node */
import { createRequest, createResponse } from 'node-mocks-http'
import { closeDRSSession } from '@/utils/scheduling/drs/webServices/sessions'
import handler from './logout'

jest.mock('@/utils/scheduling/drs/webServices/sessions', () => ({
  closeDRSSession: jest.fn(),
}))

const mockCloseDRSSession = jest.mocked(closeDRSSession)

const DRS_COOKIE_NAME = 'test-drs-session'
const COGNITO_DOMAIN = 'https://auth.example.com'
const CLIENT_ID = 'test-client-id'
const APP_URL = 'http://localhost:5001'

describe('/api/logout', () => {
  const originalEnv = { ...process.env }
  let consoleError: jest.SpyInstance

  beforeEach(() => {
    process.env.NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME = DRS_COOKIE_NAME
    process.env.COGNITO_DOMAIN = COGNITO_DOMAIN
    process.env.COGNITO_CLIENT_ID = CLIENT_ID
    process.env.NEXTAUTH_URL = APP_URL
    mockCloseDRSSession.mockResolvedValue(undefined)
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    consoleError.mockRestore()
  })

  const call = async (method = 'GET', cookieHeader?: string) => {
    const req = createRequest({
      method: method as never,
      headers: cookieHeader ? { cookie: cookieHeader } : {},
    })
    const res = createResponse()

    await handler(req as never, res as never)

    return res
  }

  // Names of the cookies the response tells the browser to expire
  const expiredCookies = (res: ReturnType<typeof createResponse>) =>
    ((res.getHeader('Set-Cookie') as string[]) ?? [])
      .filter((header) => header.includes('Max-Age=0'))
      .map((header) => header.split('=')[0])

  const signedInCookies = `next-auth.session-token=abc; ${DRS_COOKIE_NAME}=drs-session-id`

  describe.each(['POST', 'PUT', 'DELETE'])('a %s request', (method) => {
    it('is rejected with 405 and does nothing else', async () => {
      const res = await call(method, signedInCookies)

      expect(res._getStatusCode()).toBe(405)
      expect(res.getHeader('Allow')).toBe('GET')
      expect(JSON.parse(res._getData())).toEqual({
        message: 'Method not allowed',
      })
      expect(mockCloseDRSSession).not.toHaveBeenCalled()
      expect(res.getHeader('Set-Cookie')).toBeUndefined()
    })
  })

  describe('a GET request', () => {
    it('redirects to the Cognito logout, returning to /login afterwards', async () => {
      const res = await call('GET', signedInCookies)

      const expected = new URL('/logout', COGNITO_DOMAIN)
      expected.searchParams.set('client_id', CLIENT_ID)
      expected.searchParams.set('logout_uri', `${APP_URL}/login`)

      expect(res._getStatusCode()).toBe(302)
      expect(res._getRedirectUrl()).toBe(expected.href)
    })

    it('expires the session and DRS cookies in the same response', async () => {
      const res = await call('GET', signedInCookies)

      expect(res._getRedirectUrl()).not.toBe('')
      expect(expiredCookies(res)).toEqual(
        expect.arrayContaining(['next-auth.session-token', DRS_COOKIE_NAME])
      )
    })

    it('still redirects when there are no cookies (already signed out)', async () => {
      const res = await call('GET')

      expect(res._getStatusCode()).toBe(302)
      expect(res._getRedirectUrl()).toContain(COGNITO_DOMAIN)
    })
  })

  describe('the DRS session', () => {
    it('is closed when there is a DRS cookie', async () => {
      await call('GET', signedInCookies)

      expect(mockCloseDRSSession).toHaveBeenCalledTimes(1)
      expect(mockCloseDRSSession).toHaveBeenCalledWith('drs-session-id')
    })

    it('is not closed when there is no DRS cookie', async () => {
      await call('GET', 'next-auth.session-token=abc')

      expect(mockCloseDRSSession).not.toHaveBeenCalled()
    })

    it('failing to close it is logged, and the user is still signed out', async () => {
      mockCloseDRSSession.mockRejectedValue(new Error('DRS is down'))

      const res = await call('GET', signedInCookies)

      expect(consoleError).toHaveBeenCalledWith(
        'Unable to close DRS session',
        expect.objectContaining({ message: 'DRS is down' })
      )
      expect(res._getStatusCode()).toBe(302)
      expect(res._getRedirectUrl()).toContain(COGNITO_DOMAIN)
      expect(expiredCookies(res)).toEqual(
        expect.arrayContaining(['next-auth.session-token', DRS_COOKIE_NAME])
      )
    })
  })

  describe.each(['COGNITO_DOMAIN', 'COGNITO_CLIENT_ID', 'NEXTAUTH_URL'])(
    'when %s is not set',
    (variable) => {
      beforeEach(() => {
        delete process.env[variable]
      })

      it('returns 500, does not redirect, and logs an error', async () => {
        const res = await call('GET', signedInCookies)

        expect(res._getStatusCode()).toBe(500)
        expect(JSON.parse(res._getData())).toEqual({
          message: 'Unable to sign out',
        })
        expect(res._getRedirectUrl()).toBe('')
        expect(consoleError).toHaveBeenCalledWith(
          'Unable to sign out',
          expect.objectContaining({
            message: 'Missing Cognito logout configuration',
          })
        )
      })

      it('still expires the cookies', async () => {
        const res = await call('GET', signedInCookies)

        expect(expiredCookies(res)).toEqual(
          expect.arrayContaining(['next-auth.session-token', DRS_COOKIE_NAME])
        )
      })
    }
  )
})
