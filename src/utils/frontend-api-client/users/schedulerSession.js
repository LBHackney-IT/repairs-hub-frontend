import axios from 'axios'

export const getSchedulerSessionId = async () => {
  const { data } = await axios.get('/api/users/schedulerSession')

  return data
}
