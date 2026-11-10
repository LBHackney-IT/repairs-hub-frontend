import { createPublicKey, verify } from 'node:crypto'
import { encode } from 'next-auth/jwt'
import { authOptions } from '../../src/utils/auth/authOptions'
import { SESSION_COOKIE_NAME } from '../../factories/session_cookie'

// A real Cognito sign-in for the e2e tests: a test user in a separate pool, with
// a password, signed in directly (no hosted UI or Google). The app client must
// be public with ALLOW_USER_PASSWORD_AUTH. These stay in the Node process: they
// are never passed to the browser, so don't use Cypress.env or a CYPRESS_ prefix.
const VARIABLES = [
  'COGNITO_E2E_ISSUER',
  'COGNITO_E2E_CLIENT_ID',
  'COGNITO_E2E_USERNAME',
  'COGNITO_E2E_PASSWORD',
] as const

// Names every missing variable at once, so one failure says what to set
const assertConfigured = () => {
  const missing = VARIABLES.filter((name) => !process.env[name]?.trim())

  if (missing.length) {
    throw new Error(
      `Set ${missing.join(
        ', '
      )} to sign in as the Cognito test user (see the README)`
    )
  }
}

const requiredEnvironment = (name: typeof VARIABLES[number]) => {
  const value = process.env[name]?.trim()

  if (!value) throw new Error(`${name} must be set to sign in to Cognito`)

  return value
}

// What the usual InitiateAuth errors mean for this setup
const SIGN_IN_HINTS: Record<string, string> = {
  ResourceNotFoundException:
    'Cognito has no app client with COGNITO_E2E_CLIENT_ID in the pool and region of COGNITO_E2E_ISSUER. Check the client id, and that the issuer is https://cognito-idp.<region>.amazonaws.com/<pool id> for the same pool',
  NotAuthorizedException:
    'wrong username or password, or the app client has a secret (it must be a public client)',
  UserNotFoundException: 'no user with that username in the pool',
  UserNotConfirmedException: 'the test user is not confirmed',
  PasswordResetRequiredException: 'the test user must reset their password',
  InvalidParameterException:
    'the app client does not allow the USER_PASSWORD_AUTH flow',
}

const decodeSegment = (segment: string) =>
  JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'))

const requestIdToken = async (
  issuer: string,
  clientId: string
): Promise<string> => {
  let response: Response

  try {
    response = await fetch(new URL(issuer).origin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
      },
      body: JSON.stringify({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: clientId,
        AuthParameters: {
          USERNAME: requiredEnvironment('COGNITO_E2E_USERNAME'),
          PASSWORD: requiredEnvironment('COGNITO_E2E_PASSWORD'),
        },
      }),
    })
  } catch (error) {
    throw new Error(`Cannot reach Cognito at ${issuer}: ${error.message}`)
  }

  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    const type = result.__type ?? response.status
    const hint = SIGN_IN_HINTS[type] ? ` (${SIGN_IN_HINTS[type]})` : ''

    // Never include the request: it holds the password
    throw new Error(`Cognito sign-in failed: ${type}${hint}`)
  }
  if (result.ChallengeName) {
    throw new Error(
      `The Cognito test user needs an unsupported challenge: ${result.ChallengeName}`
    )
  }

  const idToken = result.AuthenticationResult?.IdToken

  if (!idToken) throw new Error('Cognito sign-in returned no id token')

  return idToken
}

// The signature, issuer, audience, token type and expiry, like a real consumer
// of the token would check
const verifyIdToken = async (
  idToken: string,
  issuer: string,
  clientId: string
) => {
  const [header, payload, signature] = idToken.split('.')
  const { alg, kid } = decodeSegment(header)

  if (alg !== 'RS256' || !kid) {
    throw new Error('The Cognito id token is not signed with RS256')
  }

  const keysResponse = await fetch(`${issuer}/.well-known/jwks.json`)

  if (!keysResponse.ok)
    throw new Error('Unable to load the Cognito signing keys')

  const { keys } = await keysResponse.json()
  const jwk = keys?.find((key: { kid: string }) => key.kid === kid)

  if (!jwk) throw new Error('The Cognito id token signing key was not found')

  const signatureValid = verify(
    'RSA-SHA256',
    Buffer.from(`${header}.${payload}`),
    createPublicKey({ key: jwk, format: 'jwk' }),
    Buffer.from(signature, 'base64url')
  )
  const claims = decodeSegment(payload)

  if (!signatureValid)
    throw new Error('The Cognito id token signature is invalid')
  if (claims.iss !== issuer)
    throw new Error('The Cognito id token issuer differs')
  if (claims.aud !== clientId)
    throw new Error('The Cognito id token audience differs')
  if (claims.token_use !== 'id')
    throw new Error('The Cognito token is not an id token')
  if (claims.exp * 1000 <= Date.now())
    throw new Error('The Cognito id token has expired')

  return claims
}

type JwtCallback = NonNullable<NonNullable<typeof authOptions.callbacks>['jwt']>

// The session cookie the app would have after a Cognito sign-in: the real id
// token goes through the app's own `jwt` callback, then is encrypted with the
// app's secret.
export const signRealCognitoSession = async () => {
  assertConfigured()

  const issuer = requiredEnvironment('COGNITO_E2E_ISSUER')
  const clientId = requiredEnvironment('COGNITO_E2E_CLIENT_ID')
  const idToken = await requestIdToken(issuer, clientId)
  const claims = await verifyIdToken(idToken, issuer, clientId)

  const token = await (authOptions.callbacks.jwt as JwtCallback)({
    token: { sub: claims.sub, name: claims.name, email: claims.email },
    user: { id: claims.sub },
    account: {
      provider: 'cognito',
      type: 'oauth',
      providerAccountId: claims.sub,
      id_token: idToken,
    },
    profile: claims,
  } as Parameters<JwtCallback>[0])

  const value = await encode({ secret: process.env.NEXTAUTH_SECRET, token })

  return {
    name: SESSION_COOKIE_NAME,
    value,
    groups: token.groups,
    expiresAt: token.cognitoTokenExpiresAt,
  }
}
