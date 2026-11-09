import { clearSession } from '@/utils/auth/clearSession'
import { ALL_ROLES } from '@/utils/user'

const Logout = () => null

// Ends the Cognito hosted-UI session (and so the upstream Google session) so
// "Sign in" can't silently log the user straight back in. Needs COGNITO_DOMAIN,
// and `<NEXTAUTH_URL>/login` allowed as a sign-out URL on the app client.
// No refresh token is stored, so there is nothing to revoke.
const cognitoLogoutUrl = () => {
  const cognitoDomain = process.env.COGNITO_DOMAIN
  const clientId = process.env.COGNITO_CLIENT_ID
  const appUrl = process.env.NEXTAUTH_URL

  if (!cognitoDomain || !clientId || !appUrl) {
    throw new Error('Missing Cognito logout configuration')
  }

  const logoutUrl = new URL('/logout', cognitoDomain)
  logoutUrl.searchParams.set('client_id', clientId)
  logoutUrl.searchParams.set('logout_uri', new URL('/login', appUrl).href)

  return logoutUrl.href
}

export const getServerSideProps = async ({ req, res }) => {
  let logoutUrl: string | undefined

  try {
    logoutUrl = cognitoLogoutUrl()
  } catch (error) {
    // Still clear the local session and fall back to /login
    console.error('Unable to construct Cognito logout URL', error)
  }

  await clearSession(req, res, logoutUrl)

  return { props: {} }
}

Logout.permittedRoles = [...ALL_ROLES]

export default Logout
