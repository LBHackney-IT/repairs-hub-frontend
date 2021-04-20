import cookie from 'cookie'
import axios from 'axios'
import * as HttpStatus from 'http-status-codes'

import { isAuthorised } from './GoogleAuth'
import { paramsSerializer } from './urls'

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
    'Content-Type': 'application/json',
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

  // Log successful responses
  api.interceptors.response.use((response) => {
    console.info(
      `Service API response: ${response.status} ${
        response.statusText
      } ${JSON.stringify(response.data)}`
    )

    return response
  })

  const { data } = await api({
    method: request.method,
    headers,
    url: `${REPAIRS_SERVICE_API_URL}/${path?.join('/')}`,
    params: queryParams,
    paramsSerializer: paramsSerializer,
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
    } catch (error) {
      const errorResponse = error.response
      if (errorResponse) {
        // The request was made and the server responded with a non-200 status
        console.error(
          'Service API response',
          JSON.stringify({
            status: errorResponse?.status,
            data: errorResponse?.data,
            headers: errorResponse?.headers,
          })
        )

        // When we get a 404 from the service API
        errorResponse?.status === HttpStatus.NOT_FOUND
          ? res
              .status(HttpStatus.NOT_FOUND)
              .json({ message: `Resource not found` })
          : // Return the actual error status and message from the service API
            res
              .status(errorResponse?.status)
              .json({ message: errorResponse?.data || 'Service API error' })
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Cannot connect to Service API')
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'No response received from Service API' })
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('API Client could not setup request', error.message)
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'API Client request setup error' })
      }
    }
  }
}
