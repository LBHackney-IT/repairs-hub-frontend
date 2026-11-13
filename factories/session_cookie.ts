import { encode } from 'next-auth/jwt'

export const SESSION_COOKIE_NAME = 'next-auth.session-token'

const base64url = (value: object) =>
  Buffer.from(JSON.stringify(value)).toString('base64url')

// Unsigned id token. Only the payload is read (readCognitoIdTokenClaims).
export const makeIdToken = (claims: Record<string, unknown> = {}) =>
  [
    base64url({ alg: 'none', typ: 'JWT' }),
    base64url({
      sub: 'cognito-sub',
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      ...claims,
    }),
    'signature',
  ].join('.')

type SessionOptions = {
  name?: string
  email?: string
  groups?: string[]
  // seconds since epoch, like the `exp` claim
  exp?: number
  // set to false for a session cookie with no Cognito id token in it
  idToken?: boolean
  secret?: string
}

// Same shape the `jwt` callback in authOptions stores in the session cookie.
export const signSessionCookie = async ({
  name = 'name',
  email = 'name@example.com',
  groups = [process.env.AGENTS_GOOGLE_GROUPNAME],
  exp = Math.floor(Date.now() / 1000) + 60 * 60,
  idToken = true,
  secret = process.env.NEXTAUTH_SECRET,
}: SessionOptions = {}) => {
  const cognitoIdToken = makeIdToken({ name, email, exp })

  const value = await encode({
    secret,
    token: {
      name,
      email,
      groups,
      cognitoSub: 'cognito-sub',
      cognitoTokenExpiresAt: exp,
      ...(idToken && { cognitoIdToken }),
    },
  })

  return {
    name: SESSION_COOKIE_NAME,
    value,
    // the id token the API clients should forward to the backend
    idToken: cognitoIdToken,
    // spread into createRequest({ ...session.requestOptions })
    requestOptions: {
      headers: { Cookie: `${SESSION_COOKIE_NAME}=${value};` },
      cookies: { [SESSION_COOKIE_NAME]: value },
    },
  }
}
