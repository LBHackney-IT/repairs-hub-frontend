import type { ServerResponse } from 'http'
import { getAuthenticatedUser } from './auth'

export const AUTH_WHITELIST = ['/login', '/access-denied']

export const redirectToHome = (res) => {
  res.writeHead(302, {
    Location: '/',
  })
  res.end()
}

const redirectToLogin = (res) => {
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
