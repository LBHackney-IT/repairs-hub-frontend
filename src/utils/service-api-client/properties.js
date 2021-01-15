import axios from 'axios'

const { REPAIRS_SERVICE_API_URL, REPAIRS_SERVICE_API_KEY } = process.env

const headers = { 'x-api-key': REPAIRS_SERVICE_API_KEY }

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
