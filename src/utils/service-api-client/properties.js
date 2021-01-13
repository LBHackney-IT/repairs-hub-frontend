import AuthHeader from '../AuthHeader'
import axios from 'axios'

const { REPAIRS_SERVICE_API_URL } = process.env

export const getProperties = async (params) => {
  const { status, data } = await axios.get(
    `${REPAIRS_SERVICE_API_URL}/properties`,
    {
      params,
      headers: AuthHeader(),
    }
  )

  return { status, data }
}

export const getProperty = async (propertyReference) => {
  const { status, data } = await axios.get(
    `${REPAIRS_SERVICE_API_URL}/properties/${propertyReference}`,
    {
      headers: AuthHeader(),
    }
  )

  return { status, data }
}
