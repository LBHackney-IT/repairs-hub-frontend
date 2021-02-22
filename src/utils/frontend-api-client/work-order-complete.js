import axios from 'axios'

// Posting cancel work order uses same workOrderComplete endpoint
export const postWorkOrderComplete = async (formData) => {
  const { data } = await axios.post(`/api/workOrderComplete`, formData)

  return data
}
