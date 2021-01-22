import axios from 'axios'

export const postCompleteWorkOrder = async (formData) => {
  const { data } = await axios.post(`/api/workOrderComplete`, formData)

  return data
}
