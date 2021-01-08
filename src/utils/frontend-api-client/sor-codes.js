import axios from 'axios'

export const getSorCodes = async () => {
  const { data } = await axios.get(`/api/sor-codes`)

  return data
}
