import axios from 'axios'

const { REPAIRS_SERVICE_API_URL, REPAIRS_SERVICE_API_TOKEN } = process.env

const headers = { Authorization: `Bearer ${REPAIRS_SERVICE_API_TOKEN}` }

export const getProperties = async (params) => {
  const { data } = await axios.get(`${REPAIRS_SERVICE_API_URL}/properties`, {
    params,
    headers,
  })

  return data
}

export const getProperty = async (propertyReference) => {
  const { data } = await axios.get(
    `${REPAIRS_SERVICE_API_URL}/properties/${propertyReference}`,
    {
      headers,
    }
  )

  return data
}
