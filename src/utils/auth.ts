import type { IncomingMessage } from 'http'
import { getToken } from 'next-auth/jwt'
import { buildUser } from './user'

type AuthRequest = Parameters<typeof getToken>[0]['req'] | IncomingMessage

// Null when there is no session or the Cognito id token has expired.
export const getAuthToken = async (req: AuthRequest) => {
  const token = await getToken({
    req: req as Parameters<typeof getToken>[0]['req'],
  })

  if (!token?.cognitoIdToken) {
    return null
  }

  if (
    token.cognitoTokenExpiresAt &&
    token.cognitoTokenExpiresAt * 1000 <= Date.now()
  ) {
    return null
  }

  return token
}

export const getAuthenticatedUser = async (req: AuthRequest) => {
  const token = await getAuthToken(req)

  if (!token) {
    return null
  }

  return buildUser(token.name, token.email, token.groups ?? [])
}

// Token forwarded to the backend APIs.
export const getApiToken = async (req: AuthRequest) => {
  const token = await getAuthToken(req)

  return token?.cognitoIdToken
}
