import * as cookie from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'

const nextAuthCookiePattern = /^(?:__Secure-|__Host-)?next-auth\./

// Expires the next-auth cookies on the request (including chunked ones) and the
// DRS session cookie.
export function clearStaffSessionCookies(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  const requestCookies = cookie.parse(req.headers.cookie ?? '')
  const names = new Set([
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    process.env.NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME,
    ...Object.keys(requestCookies).filter((name) =>
      nextAuthCookiePattern.test(name)
    ),
  ])

  res.setHeader(
    'Set-Cookie',
    [...names].map((name) =>
      cookie.serialize(name, '', {
        expires: new Date(0),
        httpOnly: true,
        maxAge: 0,
        path: '/',
        sameSite: 'lax',
        secure:
          name.startsWith('__') ||
          process.env.NEXTAUTH_URL?.startsWith('https://') === true,
      })
    )
  )
}
