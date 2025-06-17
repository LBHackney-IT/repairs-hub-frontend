import { deleteSessions } from '@/utils/googleAuth'
import { closeDRSSession } from '@/utils/scheduling/drs/webServices/sessions'
import cookie from 'cookie'
import { ALL_ROLES } from '@/root/src/utils/auth/user'

const Logout = () => null

export const getServerSideProps = async ({ req, res }) => {
  const cookies = cookie.parse(req.headers.cookie ?? '')
  const schedulerSessionId =
    cookies[process.env.NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME]

  if (schedulerSessionId) {
    await closeDRSSession(schedulerSessionId)
  }

  deleteSessions(res, {
    additionalCookies: {
      [process.env.NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME]: {
        path: '/',
      },
    },
  })

  return { props: {} }
}

Logout.permittedRoles = [...ALL_ROLES]

export default Logout
