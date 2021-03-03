import cookie from 'cookie'
import axios from 'axios'
import * as HttpStatus from 'http-status-codes'

import { isAuthorised } from './GoogleAuth'

const {
  REPAIRS_SERVICE_API_URL,
  REPAIRS_SERVICE_API_KEY,
  GSSO_TOKEN_NAME,
} = process.env

export const serviceAPIRequest = async (request) => {
  const cookies = cookie.parse(request.headers.cookie ?? '')
  const token = cookies[GSSO_TOKEN_NAME]

  const headers = {
    'x-api-key': REPAIRS_SERVICE_API_KEY,
    'x-hackney-user': token,
  }

  let { path, ...queryParams } = request.query

  const api = axios.create()

  // Log request
  api.interceptors.request.use((request) => {
    console.info(
      'Starting Service API request:',
      JSON.stringify({
        ...request,
        headers: {
          ...request.headers,
          'x-api-key': '[REMOVED]',
          'x-hackney-user': '[REMOVED]',
        },
      })
    )

    return request
  })

  // Log response
  api.interceptors.response.use((response) => {
    console.info(
      `Service API response: ${response.status} ${response.statusText}`
    )

    return response
  })

  const { data } = await api({
    method: request.method,
    headers,
    url: `${REPAIRS_SERVICE_API_URL}/${path?.join('/')}`,
    params: queryParams,
    data: request.body,
  })

  return data
}

export const authoriseServiceAPIRequest = (callBack) => {
  return async (req, res) => {
    const user = isAuthorised({ req })
    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Auth cookie missing.' })
    }
    try {
      // Call the function defined in the API route
      return await callBack(req, res, user)
    } catch (err) {
      console.log(`Service API ${req.method} error:`, err)

      err?.response?.status === HttpStatus.NOT_FOUND
        ? res
            .status(HttpStatus.NOT_FOUND)
            .json({ message: `Resource not found` })
        : res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Service API server error' })
    }
  }
}
