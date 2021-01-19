import axios from 'axios'

const { REPAIRS_SERVICE_API_URL, REPAIRS_SERVICE_API_KEY } = process.env

const headers = { 'x-api-key': REPAIRS_SERVICE_API_KEY }

export const serviceAPIRequest = async (method, query, body) => {
  const { path, ...queryParams } = query

  const serviceAPIpath = path.join('/')

  const { data } = await axios({
    method,
    headers,
    url: `${REPAIRS_SERVICE_API_URL}/${serviceAPIpath}`,
    params: queryParams,
    data: body,
  })

  return data
}
