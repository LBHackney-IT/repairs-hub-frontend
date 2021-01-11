import axios from 'axios'

export const getProperties = async (params) => {
  const { data } = await axios.get(`/api/properties/?q=${params}`)

  return data
}

export const getProperty = async (propertyReference) => {
  const { data } = await axios.get(`/api/properties/${propertyReference}`)

  return data
}
