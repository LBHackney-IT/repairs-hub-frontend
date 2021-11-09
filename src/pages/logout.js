import { deleteSessions } from '@/utils/googleAuth'
import { closeDRSSession } from '@/utils/scheduling/drs/webServices/sessions'
import cookie from 'cookie'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from '@/utils/user'

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

Logout.permittedRoles = [
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
]

export default Logout
