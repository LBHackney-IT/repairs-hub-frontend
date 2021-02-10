import axios from 'axios'

export const getPriorities = async () => {
  const { data } = await axios.get('/api/schedule-of-rates/priorities')

  return data
}
