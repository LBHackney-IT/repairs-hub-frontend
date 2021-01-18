import axios from 'axios'

const { REPAIRS_SERVICE_API_URL, REPAIRS_SERVICE_API_KEY } = process.env

const headers = { 'x-api-key': REPAIRS_SERVICE_API_KEY }

export const getSorCodes = async () => {
  const { data } = await axios.get(
    `${REPAIRS_SERVICE_API_URL}/schedule-of-rates/codes`,
    {
      headers,
    }
  )

  return data
}
