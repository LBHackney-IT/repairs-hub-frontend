export type CognitoIdTokenClaims = {
  sub?: string
  exp?: number
  email?: string
  name?: string
  'custom:groups'?: unknown
}

// Payload only; openid-client already verified the signature at sign-in.
export function readCognitoIdTokenClaims(
  idToken: string
): CognitoIdTokenClaims | undefined {
  const payload = idToken.split('.')[1]

  if (!payload) {
    return undefined
  }

  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
  } catch {
    return undefined
  }
}
