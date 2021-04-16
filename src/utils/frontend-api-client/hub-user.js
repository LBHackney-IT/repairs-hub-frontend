import axios from 'axios'

export const getCurrentUser = async () => {
  const { data } = await axios.get(`/api/hub-user`)

  return data
}
