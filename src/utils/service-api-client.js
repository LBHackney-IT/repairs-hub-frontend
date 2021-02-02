import axios from 'axios'

const { REPAIRS_SERVICE_API_URL, REPAIRS_SERVICE_API_KEY } = process.env

const headers = { 'x-api-key': REPAIRS_SERVICE_API_KEY }

export const serviceAPIRequest = async (method, path, queryParams, body) => {
  const { data } = await axios({
    method,
    headers,
    url: `${REPAIRS_SERVICE_API_URL}/${path}`,
    params: queryParams,
    data: body,
  })

  return data
}
