import axios from 'axios'

console.log(process.env.ENDPOINT_API)

const { ENDPOINT_API } = process.env

export const getProperties = async (params) => {
  const { data } = await axios.get(
    `${ENDPOINT_API}/properties/?q=${params}`
  )

  return data
}

export const getProperty = async (propertyReference) => {
  const { data } = await axios.get(
    `${ENDPOINT_API}/properties/${propertyReference}`
  )

  return data
}
