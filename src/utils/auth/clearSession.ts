import cookie from 'cookie'
import { closeDRSSession } from '@/utils/scheduling/drs/webServices/sessions'
import { deleteSessions, nextAuthCookiesForDeletion } from './authSession'

// Ends the app's own session (DRS session, DRS cookie and next-auth cookies),
// then redirects to `redirectTo` (default /login). Knows nothing about Cognito.
export const clearSession = async (req, res, redirectTo?: string) => {
  const drsCookieName = process.env.NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME
  const cookies = cookie.parse(req.headers.cookie ?? '')
  const schedulerSessionId = cookies[drsCookieName]

  if (schedulerSessionId) {
    await closeDRSSession(schedulerSessionId)
  }

  deleteSessions(res, {
    redirectTo,
    additionalCookies: {
      [drsCookieName]: { path: '/' },
      ...nextAuthCookiesForDeletion(req),
    },
  })
}
