import axios from 'axios'

export const getRepairs = async (propertyReference = null) => {
  if (propertyReference) {
    const { data } = await axios.get(
      `/api/repairs/?propertyReference=${propertyReference}`
    )

    return data
  }
  const { data } = await axios.get('/api/repairs')

  return data
}

export const getRepair = async (workOrderReference) => {
  const { data } = await axios.get(`/api/repairs/${workOrderReference}`)

  return data
}
