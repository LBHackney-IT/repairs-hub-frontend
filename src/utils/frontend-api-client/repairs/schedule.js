import axios from 'axios'

export const postRepair = async (formData) => {
  const { data } = await axios.post(`/api/repairs/schedule`, formData)

  return data
}
