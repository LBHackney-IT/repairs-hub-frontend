/** @jest-environment node */
import { createRequest, createResponse } from 'node-mocks-http'
import { clearStaffSessionCookies } from './cookies'

const DRS_COOKIE_NAME = 'test-drs-session'

describe('clearStaffSessionCookies', () => {
  const originalEnv = { ...process.env }

  beforeAll(() => {
    process.env.NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME = DRS_COOKIE_NAME
  })

  afterAll(() => {
    process.env = originalEnv
  })

  // Names of the cookies the response tells the browser to expire
  const clearedCookies = (cookieHeader: string) => {
    const req = createRequest({ headers: { cookie: cookieHeader } })
    const res = createResponse()

    clearStaffSessionCookies(req as never, res as never)

    const setCookie = res.getHeader('Set-Cookie') as string[]

    return setCookie
      .filter((header) => header.includes('Max-Age=0'))
      .map((header) => header.split('=')[0])
  }

  it('clears the next-auth cookies, including chunked session cookies', () => {
    const cleared = clearedCookies(
      [
        'next-auth.session-token.0=a',
        'next-auth.session-token.1=b',
        '__Secure-next-auth.session-token=c',
        'next-auth.csrf-token=d',
        'next-auth.callback-url=e',
      ].join('; ')
    )

    expect(cleared).toEqual(
      expect.arrayContaining([
        'next-auth.session-token',
        '__Secure-next-auth.session-token',
        'next-auth.session-token.0',
        'next-auth.session-token.1',
        'next-auth.csrf-token',
        'next-auth.callback-url',
      ])
    )
  })

  it('clears the DRS session cookie', () => {
    expect(clearedCookies(`${DRS_COOKIE_NAME}=session-id`)).toContain(
      DRS_COOKIE_NAME
    )
  })

  it('does not clear unrelated cookies', () => {
    const cleared = clearedCookies(
      [
        'next-auth.session-token=a',
        `${DRS_COOKIE_NAME}=b`,
        '_ga=c',
        'theme=dark',
        'my-next-auth.session-token=d',
      ].join('; ')
    )

    expect(cleared).not.toContain('_ga')
    expect(cleared).not.toContain('theme')
    expect(cleared).not.toContain('my-next-auth.session-token')
  })
})
