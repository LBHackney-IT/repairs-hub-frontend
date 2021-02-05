import axios from 'axios'

export const postJobStatusUpdate = async (formData) => {
  const { data } = await axios.post(`/api/jobStatusUpdate`, formData)

  return data
}
