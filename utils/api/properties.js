import axios from 'axios'

const { NEXT_PUBLIC_ENDPOINT_API } = process.env

export const getProperties = async (params) => {
  const { data } = await axios.get(
    `${NEXT_PUBLIC_ENDPOINT_API}/properties/?q=${params}`
  )

  return data
}

export const getProperty = async (propertyReference) => {
  const { data } = await axios.get(
    `${NEXT_PUBLIC_ENDPOINT_API}/properties/${propertyReference}`
  )

  return data
}
