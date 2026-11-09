import * as cookie from 'cookie'
import { StatusCodes } from 'http-status-codes'
import type { NextApiHandler } from 'next'
import { clearStaffSessionCookies } from '@/utils/auth/cookies'
import { closeDRSSession } from '@/utils/scheduling/drs/webServices/sessions'

const endpoint: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ message: 'Method not allowed' })
    return
  }

  try {
    const cookies = cookie.parse(req.headers.cookie ?? '')
    const schedulerSessionId =
      cookies[process.env.NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME]

    if (schedulerSessionId) {
      await closeDRSSession(schedulerSessionId)
    }

    clearStaffSessionCookies(req, res)

    const cognitoDomain = process.env.COGNITO_DOMAIN
    const clientId = process.env.COGNITO_CLIENT_ID
    const appUrl = process.env.NEXTAUTH_URL
    if (!cognitoDomain || !clientId || !appUrl) {
      throw new Error('Missing Cognito logout configuration')
    }

    const logoutUrl = new URL('/logout', cognitoDomain)
    logoutUrl.searchParams.set('client_id', clientId)
    logoutUrl.searchParams.set('logout_uri', new URL('/login', appUrl).href)

    res.redirect(302, logoutUrl.href)
  } catch (error) {
    console.error('Unable to sign out', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Unable to sign out' })
  }
}

export default endpoint
