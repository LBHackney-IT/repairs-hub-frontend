import type { NextAuthOptions } from 'next-auth'
import CognitoProvider, {
  type CognitoProfile
} from 'next-auth/providers/cognito'

import { parseCognitoGroups } from './cognitoGroups'
import { readCognitoIdTokenClaims } from './cognitoIdToken'

type CognitoProfileWithGroups = CognitoProfile & {
  exp?: number
  'custom:groups'?: unknown
}

// TODO: must match the Cognito app client's id token validity (no refresh).
export const sessionMaxAgeSeconds = 4 * 60 * 60

type AuthErrorMetadata = {
  error?: unknown
  error_description?: unknown
  providerId?: unknown
}

// Metadata can contain tokens/profiles, so only log named scalars from it.
function describeAuthError(metadata: unknown): string {
  const container = (metadata ?? {}) as AuthErrorMetadata
  const cause = (container.error ?? metadata) as
    | (Error & AuthErrorMetadata)
    | undefined

  const details: string[] = []

  if (cause instanceof Error) {
    details.push(`${cause.name}: ${cause.message}`)
  }
  if (typeof cause?.error === 'string') {
    details.push(`oauth_error=${cause.error}`)
  }
  const description = container.error_description ?? cause?.error_description
  if (typeof description === 'string') {
    details.push(`oauth_error_description=${description}`)
  }
  if (typeof container.providerId === 'string') {
    details.push(`provider=${container.providerId}`)
  }

  return details.join(' | ')
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CognitoProvider<CognitoProfileWithGroups>({
      clientId: process.env.COGNITO_CLIENT_ID ?? '',
      clientSecret: process.env.COGNITO_CLIENT_SECRET ?? '',
      issuer: process.env.COGNITO_ISSUER,
      authorization: {
        params: {
          scope: 'openid email profile',
          // Skips the Cognito provider chooser; must match the user pool's provider name.
          identity_provider: 'Google',
        },
      },
      checks: ['pkce', 'state', 'nonce'],
      // Default 3.5s can fail discovery/token exchange.
      httpOptions: { timeout: 10000 },
      client: {
        // HTTP Basic often returns invalid_client from Cognito.
        token_endpoint_auth_method: 'client_secret_post',
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: sessionMaxAgeSeconds,
  },
  jwt: {
    maxAge: sessionMaxAgeSeconds,
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  logger: {
    error(code, metadata) {
      console.error(`NextAuth error ${code}`, describeAuthError(metadata))
    },
    warn(code) {
      console.warn(`NextAuth warning ${code}`)
    },
    debug() {},
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        const claims = account.id_token
          ? readCognitoIdTokenClaims(account.id_token)
          : undefined
        const cognitoProfile = profile as CognitoProfileWithGroups | undefined

        if (!account.id_token || !claims?.sub || !claims.exp) {
          throw new Error('Cognito response did not contain a valid ID token')
        }

        token.cognitoIdToken = account.id_token
        token.cognitoTokenExpiresAt = claims.exp
        token.cognitoSub = claims.sub
        token.email = claims.email ?? cognitoProfile?.email
        token.name = claims.name ?? cognitoProfile?.name
        token.groups = parseCognitoGroups(
          claims['custom:groups'] ?? cognitoProfile?.['custom:groups']
        )
      }

      return token
    },
    async session({ session, token }) {
      // The id token stays in the encrypted cookie, not the browser session.
      if (session.user) {
        session.user.id = token.cognitoSub
        session.user.groups = token.groups
      }

      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`

      try {
        if (new URL(url).origin === baseUrl) return url
      } catch {
        // Invalid URL: fall back to baseUrl
      }

      return baseUrl
    },
  },
}
