/** @jest-environment node */
import { createRequest, createResponse } from 'node-mocks-http'
import { getAuthenticatedUser } from './auth'
import {
  AUTH_WHITELIST,
  isAuthorised,
  redirectToAcessDenied,
  redirectToHome,
} from './authSession'

jest.mock('./auth')

const mockGetAuthenticatedUser = jest.mocked(getAuthenticatedUser)

const userWithPermissions = { name: 'Ada', hasAnyPermissions: true }
const userWithoutPermissions = { name: 'Bob', hasAnyPermissions: false }

describe('authSession', () => {
  const setup = () => ({
    req: createRequest(),
    res: createResponse(),
  })

  // What the response has been told to do so far
  const sent = (res: ReturnType<typeof createResponse>) => ({
    status: res.statusCode,
    location: res.getHeader('Location'),
    ended: res._isEndCalled(),
  })

  const redirectedTo = (location: string) => ({
    status: 302,
    location,
    ended: true,
  })

  const notRedirected = { status: 200, location: undefined, ended: false }

  describe('isAuthorised', () => {
    it('returns the user when they have permissions', async () => {
      mockGetAuthenticatedUser.mockResolvedValue(userWithPermissions as never)
      const { req, res } = setup()

      expect(await isAuthorised({ req, res }, true)).toBe(userWithPermissions)
      expect(sent(res)).toEqual(notRedirected)
    })

    describe('when there is no session', () => {
      beforeEach(() => {
        mockGetAuthenticatedUser.mockResolvedValue(null)
      })

      it('redirects to /login when asked to redirect', async () => {
        const { req, res } = setup()

        await isAuthorised({ req, res }, true)

        expect(sent(res)).toEqual(redirectedTo('/login'))
      })

      it('writes nothing and returns a falsy value when not asked to redirect', async () => {
        const { req, res } = setup()

        expect(await isAuthorised({ req, res })).toBeFalsy()
        expect(sent(res)).toEqual(notRedirected)
      })
    })

    describe('when the user has no recognised group', () => {
      beforeEach(() => {
        mockGetAuthenticatedUser.mockResolvedValue(
          userWithoutPermissions as never
        )
      })

      it('redirects to /access-denied when asked to redirect', async () => {
        const { req, res } = setup()

        await isAuthorised({ req, res }, true)

        expect(sent(res)).toEqual(redirectedTo('/access-denied'))
      })

      it('writes nothing and returns a falsy value when not asked to redirect', async () => {
        const { req, res } = setup()

        expect(await isAuthorised({ req, res })).toBeFalsy()
        expect(sent(res)).toEqual(notRedirected)
      })
    })

    it('logs an unexpected error, returns undefined and writes no redirect', async () => {
      const log = jest.spyOn(console, 'log').mockImplementation(() => {})
      mockGetAuthenticatedUser.mockRejectedValue(new Error('boom'))
      const { req, res } = setup()

      expect(await isAuthorised({ req, res }, true)).toBeUndefined()
      expect(log).toHaveBeenCalledWith('boom')
      expect(sent(res)).toEqual(notRedirected)

      log.mockRestore()
    })
  })

  describe.each([
    ['redirectToHome', redirectToHome, '/'],
    ['redirectToAcessDenied', redirectToAcessDenied, '/access-denied'],
  ])('%s', (_, redirect, location) => {
    it(`redirects to ${location}`, () => {
      const { res } = setup()

      redirect(res)

      expect(sent(res)).toEqual(redirectedTo(location))
    })
  })

  describe('AUTH_WHITELIST', () => {
    it('is exactly the pages that skip authentication', () => {
      expect(AUTH_WHITELIST).toEqual(['/login', '/access-denied'])
    })
  })
})
