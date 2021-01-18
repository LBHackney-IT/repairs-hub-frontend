import axios from 'axios'

export const getSorCodes = async () => {
  const { data } = await axios.get('/api/schedule-of-rates/codes')

  return data
}
