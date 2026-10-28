import type { ServerResponse } from 'http'
import cookie from 'cookie'
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

export const deleteSessions = (res, options = { additionalCookies: {} }) => {
  const { additionalCookies } = options

  const serializedCookies = Object.keys(additionalCookies).map((cookieName) =>
    cookie.serialize(cookieName, null, {
      maxAge: -1,
      ...additionalCookies[cookieName],
    })
  )

  res.setHeader('Set-Cookie', serializedCookies)

  redirectToLogin(res)
}

export const isAuthorised = async (
  {
    req,
    res,
  }: { req?: Parameters<typeof getAuthenticatedUser>[0]; res?: ServerResponse },
  withRedirect = false
) => {
  try {
    const user = await getAuthenticatedUser(req)

    if (!user) {
      return withRedirect && redirectToLogin(res)
    }

    if (!user.hasAnyPermissions) {
      return withRedirect && redirectToAcessDenied(res)
    }

    return user
  } catch (err) {
    console.log(err.message)
  }
}

// next-auth cookies on the request (including chunked ones), for deleteSessions.
export const nextAuthCookiesForDeletion = (req) => {
  const cookies = cookie.parse(req.headers.cookie ?? '')

  return Object.keys(cookies)
    .filter((name) => /^(__Secure-|__Host-)?next-auth\./.test(name))
    .reduce(
      (acc, name) => ({
        ...acc,
        [name]: { path: '/', secure: name.startsWith('__') },
      }),
      {}
    )
}
