import type { ServerResponse } from 'http'
import { getAuthenticatedUser } from './auth'

export const AUTH_WHITELIST = ['/login', '/access-denied']

export const redirectToHome = (res) => {
  res.writeHead(302, {
    Location: '/',
  })
  res.end()
}

export const redirectToLogin = (res) => {
  res.writeHead(302, {
    Location: '/login',
  })
  res.end()
}

export const redirectToAcessDenied = (res) => {
  res.writeHead(302, {
    Location: '/access-denied',
  })
  res.end()
}

type AuthenticatedUser = NonNullable<
  Awaited<ReturnType<typeof getAuthenticatedUser>>
>

// unauthenticated: no valid session, so the user should sign in.
// forbidden: signed in, but not in any group that gives them a role.
// authorised: signed in with at least one role.
export type AuthorisationResult =
  | { status: 'unauthenticated' }
  | { status: 'forbidden' }
  | { status: 'authorised'; user: AuthenticatedUser }

// With `withRedirect`, also writes the redirect for the result: /login when
// unauthenticated, /access-denied when forbidden.
export const checkAuthorisation = async (
  {
    req,
    res,
  }: { req?: Parameters<typeof getAuthenticatedUser>[0]; res?: ServerResponse },
  withRedirect = false
): Promise<AuthorisationResult> => {
  try {
    const user = await getAuthenticatedUser(req)

    if (!user) {
      if (withRedirect) redirectToLogin(res)
      return { status: 'unauthenticated' }
    }

    if (!user.hasAnyPermissions) {
      if (withRedirect) redirectToAcessDenied(res)
      return { status: 'forbidden' }
    }

    return { status: 'authorised', user }
  } catch (err) {
    // If we can't tell who the user is, treat them as not signed in
    console.log(err.message)
    if (withRedirect) redirectToLogin(res)
    return { status: 'unauthenticated' }
  }
}
