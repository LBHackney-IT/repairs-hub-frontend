import axios from 'axios'

export const getTasks = async (reference) => {
  const { data } = await axios.get(`/api/repairs/${reference}/tasks`)

  return data
}
