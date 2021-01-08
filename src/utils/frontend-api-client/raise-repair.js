import axios from 'axios'

export const postRaiseRepairForm = async (formData) => {
  const { data } = await axios.post(`/api/raise-repair`, formData)

  return data
}
