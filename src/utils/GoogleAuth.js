import cookie from 'cookie'
import jsonwebtoken from 'jsonwebtoken'
import { TEMPORARY_GROUP_OVERRIDE_KEY } from 'src/pages/api/staging-group-override'
import { buildUser } from './user'

const { GSSO_TOKEN_NAME } = process.env

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

export const deleteSession = (res) => {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize(GSSO_TOKEN_NAME, null, {
      maxAge: -1,
      domain: '.hackney.gov.uk',
    })
  )
  redirectToLogin(res)
}

export const isAuthorised = ({ req, res }, withRedirect = false) => {
  const { HACKNEY_JWT_SECRET } = process.env

  try {
    const cookies = cookie.parse(req.headers.cookie ?? '')
    const token = cookies[GSSO_TOKEN_NAME]

    if (!token) {
      return withRedirect && redirectToLogin(res)
    }

    const { name, email, groups = [] } = jsonwebtoken.verify(
      token,
      HACKNEY_JWT_SECRET
    )

    // TODO: Delete this once we're happy with Google log ins
    const stagingUserGroupOverride = cookies[TEMPORARY_GROUP_OVERRIDE_KEY]

    const user = buildUser(name, email, [stagingUserGroupOverride, ...groups])

    if (!user.hasAnyPermissions) {
      return withRedirect && redirectToAcessDenied(res)
    }
    return user
  } catch (err) {
    if (err instanceof jsonwebtoken.JsonWebTokenError) {
      return withRedirect && redirectToLogin(res)
    } else {
      console.log(err.message)
    }
  }
}
