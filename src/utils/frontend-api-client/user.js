import axios from 'axios'

export const getHubUser = async () => {
  const { data } = await axios.get(`/api/hub-user`)

  return data
}
