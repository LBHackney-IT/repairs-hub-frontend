import Cookies from 'universal-cookie'
import { frontEndApiRequest } from '../requests'

const SIX_HOURS_IN_SECONDS = 60 * 60 * 6

export const getOrCreateSchedulerSessionId = async () => {
  const cookies = new Cookies()

  let schedulerSessionId = cookies.get(
    process.env.NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME
  )

  if (!schedulerSessionId) {
    ;({ schedulerSessionId } = await frontEndApiRequest({
      method: 'get',
      path: `/api/users/schedulerSession`,
    }))

    cookies.set(
      process.env.NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME,
      schedulerSessionId,
      {
        path: '/',
        maxAge: SIX_HOURS_IN_SECONDS,
      }
    )
  }

  return schedulerSessionId
}
