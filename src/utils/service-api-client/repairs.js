import axios from 'axios'

const { REPAIRS_SERVICE_API_URL, REPAIRS_SERVICE_API_KEY } = process.env

export const postRepair = async (formData) => {
  const { data } = await axios.post(
    `${REPAIRS_SERVICE_API_URL}/repairs`,
    formData,
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': REPAIRS_SERVICE_API_KEY,
      },
    }
  )

  return data
}

export const getRepairs = async () => {
  const { status, data } = await axios.get(
    `${REPAIRS_SERVICE_API_URL}/repairs`,
    {
      headers: { 'x-api-key': REPAIRS_SERVICE_API_KEY },
    }
  )

  return { status, data }
}
