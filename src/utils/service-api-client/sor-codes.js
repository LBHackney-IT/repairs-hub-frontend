import axios from 'axios'

const { REPAIRS_SERVICE_API_URL, REPAIRS_SERVICE_API_KEY } = process.env

export const getSorCodes = async () => {
  const { status, data } = await axios.get(
    `${REPAIRS_SERVICE_API_URL}/schedule-of-rates/codes`,
    {
      headers: { 'x-api-key': REPAIRS_SERVICE_API_KEY },
    }
  )

  return { status, data }
}
