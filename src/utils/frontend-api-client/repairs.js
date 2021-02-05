import axios from 'axios'

export const getRepairs = async () => {
  const { data } = await axios.get('/api/repairs')

  return data
}

export const getRepairsForProperty = async (propertyReference = null) => {
  if (propertyReference) {
    const { data } = await axios.get(
      `/api/repairs/?propertyReference=${propertyReference}`
    )

    return data
  }
}

export const getRepair = async (workOrderReference) => {
  const { data } = await axios.get(`/api/repairs/${workOrderReference}`)

  return data
}
