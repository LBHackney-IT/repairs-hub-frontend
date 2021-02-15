import axios from 'axios'

export const getTrades = async () => {
  const { data } = await axios.get('/api/schedule-of-rates/trades')

  return data
}
