/** @jest-environment node */
import { createRequest, createResponse } from 'node-mocks-http'
import { getAuthenticatedUser } from './auth'
import {
  AUTH_WHITELIST,
  checkAuthorisation,
  redirectToAcessDenied,
  redirectToHome,
  redirectToLogin,
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

  describe('checkAuthorisation', () => {
    describe('when the user is signed in with permissions', () => {
      beforeEach(() => {
        mockGetAuthenticatedUser.mockResolvedValue(userWithPermissions as never)
      })

      it('is authorised, with the user', async () => {
        const { req, res } = setup()

        expect(await checkAuthorisation({ req, res })).toEqual({
          status: 'authorised',
          user: userWithPermissions,
        })
      })

      it('does not redirect, even when asked to', async () => {
        const { req, res } = setup()

        await checkAuthorisation({ req, res }, true)

        expect(sent(res)).toEqual(notRedirected)
      })
    })

    describe('when there is no session', () => {
      beforeEach(() => {
        mockGetAuthenticatedUser.mockResolvedValue(null)
      })

      it('is unauthenticated', async () => {
        const { req, res } = setup()

        expect(await checkAuthorisation({ req, res })).toEqual({
          status: 'unauthenticated',
        })
      })

      it('redirects to /login when asked to redirect', async () => {
        const { req, res } = setup()

        await checkAuthorisation({ req, res }, true)

        expect(sent(res)).toEqual(redirectedTo('/login'))
      })

      it('writes nothing when not asked to redirect', async () => {
        const { req, res } = setup()

        await checkAuthorisation({ req, res })

        expect(sent(res)).toEqual(notRedirected)
      })
    })

    describe('when the user is signed in but has no recognised group', () => {
      beforeEach(() => {
        mockGetAuthenticatedUser.mockResolvedValue(
          userWithoutPermissions as never
        )
      })

      it('is forbidden', async () => {
        const { req, res } = setup()

        expect(await checkAuthorisation({ req, res })).toEqual({
          status: 'forbidden',
        })
      })

      it('redirects to /access-denied when asked to redirect', async () => {
        const { req, res } = setup()

        await checkAuthorisation({ req, res }, true)

        expect(sent(res)).toEqual(redirectedTo('/access-denied'))
      })

      it('writes nothing when not asked to redirect', async () => {
        const { req, res } = setup()

        await checkAuthorisation({ req, res })

        expect(sent(res)).toEqual(notRedirected)
      })
    })

    describe('when looking up the user fails', () => {
      let log: jest.SpyInstance

      beforeEach(() => {
        log = jest.spyOn(console, 'log').mockImplementation(() => {})
        mockGetAuthenticatedUser.mockRejectedValue(new Error('boom'))
      })

      afterEach(() => {
        log.mockRestore()
      })

      it('logs the error and treats the user as unauthenticated', async () => {
        const { req, res } = setup()

        expect(await checkAuthorisation({ req, res })).toEqual({
          status: 'unauthenticated',
        })
        expect(log).toHaveBeenCalledWith('boom')
      })

      it('redirects to /login when asked to redirect', async () => {
        const { req, res } = setup()

        await checkAuthorisation({ req, res }, true)

        expect(sent(res)).toEqual(redirectedTo('/login'))
      })

      it('writes nothing when not asked to redirect', async () => {
        const { req, res } = setup()

        await checkAuthorisation({ req, res })

        expect(sent(res)).toEqual(notRedirected)
      })
    })
  })

  describe.each([
    ['redirectToHome', redirectToHome, '/'],
    ['redirectToLogin', redirectToLogin, '/login'],
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
