import axios from 'axios'

export const getFilters = async (modelName) => {
  const { data } = await axios.get(`/api/filter/${modelName}`)

  return data
}
