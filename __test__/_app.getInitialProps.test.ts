/** @jest-environment node */
import * as Sentry from '@sentry/nextjs'
import { createRequest, createResponse } from 'node-mocks-http'
import { checkAuthorisation } from '@/utils/auth/authSession'

jest.mock('@/utils/auth/authSession', () => ({
  ...jest.requireActual('@/utils/auth/authSession'),
  checkAuthorisation: jest.fn(),
}))

const mockCheckAuthorisation = jest.mocked(checkAuthorisation)
const addEventProcessor = (Sentry.getCurrentScope()
  .addEventProcessor as unknown) as jest.Mock

const DRS_COOKIE_NAME = 'test-drs-session'

const FULL_PAGE_LOAD = '/work-orders/1'
const CLIENT_SIDE_TRANSITION = '/_next/data/build-id/work-orders/1.json'

// The module reads the DRS cookie name when it loads, so import it after setting it
let MyApp: typeof import('@/pages/_app').default

beforeAll(async () => {
  process.env.NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME = DRS_COOKIE_NAME
  MyApp = (await import('@/pages/_app')).default
})

const authorisedUser = (...roles: string[]) =>
  ({ roles, hasRole: (role: string) => roles.includes(role) } as never)

const signedOut = () =>
  mockCheckAuthorisation.mockResolvedValue({ status: 'unauthenticated' })
const forbidden = () =>
  mockCheckAuthorisation.mockResolvedValue({ status: 'forbidden' })
const authorised = (user = authorisedUser('agent')) =>
  mockCheckAuthorisation.mockResolvedValue({ status: 'authorised', user })

const pageFor = (permittedRoles?: string[]) =>
  Object.assign(
    function Page() {
      return null
    },
    { permittedRoles }
  )

// What `_app` itself has written to the response
const redirectedTo = (res: ReturnType<typeof createResponse>) =>
  res._isEndCalled() ? res.getHeader('Location') : undefined

const run = async ({
  pathname = '/work-orders/[id]',
  url = FULL_PAGE_LOAD,
  Component = pageFor(['agent']),
}: { pathname?: string; url?: string; Component?: unknown } = {}) => {
  const ctx = {
    pathname,
    req: createRequest({ url }),
    res: createResponse(),
  }

  const props = await MyApp.getInitialProps({ ctx, Component } as never)

  return { props, ctx }
}

describe('MyApp.getInitialProps', () => {
  describe.each(['/login', '/access-denied'])('on %s', (pathname) => {
    it('skips authorisation and returns no props', async () => {
      const { props } = await run({ pathname })

      expect(props).toEqual({})
      expect(mockCheckAuthorisation).not.toHaveBeenCalled()
    })
  })

  describe.each([
    ['a full page load', FULL_PAGE_LOAD, true],
    ['a client side transition', CLIENT_SIDE_TRANSITION, false],
  ])('on %s', (_, url, withRedirect) => {
    it('asks for a redirect only when the server can write one', async () => {
      signedOut()

      const { ctx } = await run({ url })

      expect(mockCheckAuthorisation).toHaveBeenCalledWith(ctx, withRedirect)
    })

    describe('when the user is not signed in', () => {
      it('returns unauthenticated, for the browser to go to /login', async () => {
        signedOut()

        const { props, ctx } = await run({ url })

        expect(props).toEqual({ unauthenticated: true })
        expect(redirectedTo(ctx.res)).toBeUndefined()
      })
    })

    describe('when the user is signed in but has no recognised group', () => {
      it('returns access denied, without user details', async () => {
        forbidden()

        const { props, ctx } = await run({ url })

        expect(props).toEqual({ accessDenied: true })
        expect(redirectedTo(ctx.res)).toBeUndefined()
      })
    })
  })

  describe('when the user is authorised', () => {
    it('returns the user when the page permits one of their roles', async () => {
      const user = authorisedUser('agent')
      authorised(user)

      const { props, ctx } = await run({ Component: pageFor(['agent']) })

      expect(props).toEqual({ userDetails: user, accessDenied: false })
      expect(redirectedTo(ctx.res)).toBeUndefined()
    })

    it('needs only one of the user roles to be permitted', async () => {
      const user = authorisedUser('operative', 'agent')
      authorised(user)

      const { props } = await run({
        Component: pageFor(['contractor', 'agent']),
      })

      expect(props).toEqual({ userDetails: user, accessDenied: false })
    })

    it('always allows the RepairsHubError page', async () => {
      authorised(authorisedUser('operative'))
      function RepairsHubError() {
        return null
      }

      const { props } = await run({ Component: RepairsHubError })

      expect(props).toMatchObject({ accessDenied: false })
    })

    describe('when the page does not permit any of their roles', () => {
      it('redirects a full page load to /access-denied', async () => {
        const user = authorisedUser('operative')
        authorised(user)

        const { props, ctx } = await run({
          url: FULL_PAGE_LOAD,
          Component: pageFor(['agent']),
        })

        expect(props).toEqual({ userDetails: user, accessDenied: true })
        expect(ctx.res.statusCode).toBe(302)
        expect(redirectedTo(ctx.res)).toBe('/access-denied')
      })

      it('does not redirect a client side transition', async () => {
        const user = authorisedUser('operative')
        authorised(user)

        const { props, ctx } = await run({
          url: CLIENT_SIDE_TRANSITION,
          Component: pageFor(['agent']),
        })

        expect(props).toEqual({ userDetails: user, accessDenied: true })
        expect(redirectedTo(ctx.res)).toBeUndefined()
      })
    })

    describe.each([
      ['no permittedRoles', undefined],
      ['an empty permittedRoles', []],
    ])('when the page has %s', (_, permittedRoles) => {
      it('denies access', async () => {
        const log = jest.spyOn(console, 'log').mockImplementation(() => {})
        authorised()

        const { props, ctx } = await run({
          Component: pageFor(permittedRoles),
        })

        expect(props).toMatchObject({ accessDenied: true })
        expect(redirectedTo(ctx.res)).toBe('/access-denied')
        expect(log).toHaveBeenCalledWith(
          expect.stringContaining('has no permittedRoles defined')
        )

        log.mockRestore()
      })
    })
  })

  describe('Sentry cookie scrubbing', () => {
    it.each([
      ['a whitelisted page', () => {}, '/login'],
      ['a signed out request', signedOut, '/work-orders/[id]'],
      [
        'a signed in request with no recognised group',
        forbidden,
        '/work-orders/[id]',
      ],
      ['an authorised request', authorised, '/work-orders/[id]'],
    ])('is registered for %s', async (_, setUp, pathname) => {
      setUp()

      await run({ pathname })

      expect(addEventProcessor).toHaveBeenCalledTimes(1)
    })

    // Run the event processor `_app` registered over an event with these cookies
    const scrub = async (event: object) => {
      authorised()
      await run()

      return addEventProcessor.mock.calls[0][0](event, {})
    }

    it('replaces the next-auth cookies, including chunked and prefixed ones', async () => {
      const event = await scrub({
        request: {
          cookies: {
            'next-auth.session-token': 'SECRET',
            'next-auth.session-token.0': 'SECRET',
            'next-auth.session-token.1': 'SECRET',
            '__Secure-next-auth.session-token': 'SECRET',
            '__Host-next-auth.csrf-token': 'SECRET',
            'next-auth.callback-url': 'SECRET',
          },
        },
      })

      expect(Object.values(event.request.cookies)).toEqual(
        Array(6).fill('[REMOVED]')
      )
    })

    it('replaces the Contentsquare and DRS cookies', async () => {
      const event = await scrub({
        request: { cookies: { _cs_id: 'SECRET', [DRS_COOKIE_NAME]: 'SECRET' } },
      })

      expect(event.request.cookies).toEqual({
        _cs_id: '[REMOVED]',
        [DRS_COOKIE_NAME]: '[REMOVED]',
      })
    })

    it('leaves other cookies alone', async () => {
      const event = await scrub({
        request: {
          cookies: { theme: 'dark', 'my-next-auth.session-token': 'kept' },
        },
      })

      expect(event.request.cookies).toEqual({
        theme: 'dark',
        'my-next-auth.session-token': 'kept',
      })
    })

    it.each([
      ['no request', {}],
      ['a request with no cookies', { request: { url: '/x' } }],
    ])('does not throw for an event with %s', async (_, event) => {
      await expect(scrub(event)).resolves.toEqual(event)
    })
  })
})
