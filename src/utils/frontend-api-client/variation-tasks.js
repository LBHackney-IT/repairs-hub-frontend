import axios from 'axios'

export const getVariationTasks = async (params) => {
  const { data } = await axios.get(`/api/workOrders/${params}/variation-tasks`)

  return data
}
