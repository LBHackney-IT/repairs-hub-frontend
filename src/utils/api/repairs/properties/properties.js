import axios from 'axios'
import AuthHeader from '../../../../utils/AuthHeader'

const { NEXT_PUBLIC_ENDPOINT_API } = process.env

export const getProperties = async (params) => {
  const { data } = await axios.get(
    `${NEXT_PUBLIC_ENDPOINT_API}/properties/?q=${params}`,
    {
      headers: AuthHeader(),
    }
  )

  return data
}

export const getProperty = async (propertyReference) => {
  const {
    data,
  } = await axios.get(
    `${NEXT_PUBLIC_ENDPOINT_API}/properties/${propertyReference}`,
    { headers: AuthHeader() }
  )

  return data
}
