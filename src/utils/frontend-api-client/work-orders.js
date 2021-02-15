import axios from 'axios'

// Posting cancel work order uses same workOrderComplete endpoint
export const postCompleteWorkOrder = async (formData) => {
  const { data } = await axios.post(`/api/workOrderComplete`, formData)

  return data
}

export const postUpdateJob = async (formData) => {
  const { data } = await axios.post(`/api/jobStatusUpdate`, formData)

  return data
}
