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
      // `account` is only set on the sign-in request
      if (account) {
        // 1. Read the claims from the Cognito id token
        const claims = account.id_token
          ? readCognitoIdTokenClaims(account.id_token)
          : undefined
        const cognitoProfile = profile as CognitoProfileWithGroups | undefined

        // 2. Fail the sign-in if the id token is missing or incomplete
        if (!account.id_token || !claims?.sub || !claims.exp) {
          throw new Error('Cognito response did not contain a valid ID token')
        }

        // 3. Keep the id token and its expiry for backend API calls
        token.cognitoIdToken = account.id_token
        token.cognitoTokenExpiresAt = claims.exp
        token.cognitoSub = claims.sub

        // 4. Keep the identity and groups used to work out the user's roles
        token.email = claims.email ?? cognitoProfile?.email
        token.name = claims.name ?? cognitoProfile?.name
        token.groups = parseCognitoGroups(
          claims['custom:groups'] ?? cognitoProfile?.['custom:groups']
        )
      }

      return token
    },
    async session({ session, token }) {
      // 1. Expose only the user id and groups to the browser; the id token
      //    stays in the encrypted cookie
      if (session.user) {
        session.user.id = token.cognitoSub
        session.user.groups = token.groups
      }

      return session
    },
    async redirect({ url, baseUrl }) {
      // 1. Relative paths stay on this site
      if (url.startsWith('/')) return `${baseUrl}${url}`

      // 2. Absolute URLs are only allowed on this site's origin
      try {
        if (new URL(url).origin === baseUrl) return url
      } catch {
        // invalid URL, fall through
      }

      // 3. Anything else goes to the home page
      return baseUrl
    },
  },
}
