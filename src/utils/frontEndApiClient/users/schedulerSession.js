import { frontEndApiRequest } from '../requests'

// const SIX_HOURS_IN_SECONDS = 60 * 60 * 6

export const getOrCreateSchedulerSessionId = async () => {
  const { schedulerSessionId } = await frontEndApiRequest({
    method: 'get',
    path: `/api/users/schedulerSession`,
  })

  return schedulerSessionId
}
