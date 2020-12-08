import axios from 'axios'
import AuthHeader from '../../../../utils/AuthHeader'

const { NEXT_PUBLIC_ENDPOINT_API } = process.env

export const getAlerts = async (propertyReference) => {
  const {
    data,
  } = await axios.get(
    `${NEXT_PUBLIC_ENDPOINT_API}/properties/${propertyReference}/cautionary-alerts`,
    { headers: AuthHeader() }
  )

  return data
}
