import axios from 'axios'

export const getOperatives = async () => {
  const { data } = await axios.get(`/api/operatives`)

  return data
}
