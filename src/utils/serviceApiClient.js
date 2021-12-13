import cookie from 'cookie'
import axios from 'axios'
import * as HttpStatus from 'http-status-codes'
import { isAuthorised } from './googleAuth'
import { paramsSerializer } from './urls'
import { cache } from './middleware/cache'
import { CACHE_MAX_AGE_IN_SECONDS } from './helpers/cache'

const {
  REPAIRS_SERVICE_API_URL,
  REPAIRS_SERVICE_API_KEY,
  GSSO_TOKEN_NAME,
} = process.env

export const serviceAPIRequest = cache(
  async (request, response, cacheRequest = false) => {
    const cacheKey = encodeURIComponent(request.url)

    if (cacheRequest && request.cache && request.cache.has(cacheKey)) {
      const { data } = request.cache.get(cacheKey)

      response.setHeader(
        'Cache-Control',
        `public,max-age=${CACHE_MAX_AGE_IN_SECONDS}`
      )
      response.setHeader('X-Cache', 'HIT')

      return data
    }

    const cookies = cookie.parse(request.headers.cookie ?? '')
    const token = cookies[GSSO_TOKEN_NAME]

    const headers = {
      'x-api-key': REPAIRS_SERVICE_API_KEY,
      'x-hackney-user': token,
      Authorization: token,
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
            Authorization: '[REMOVED]',
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
      paramsSerializer,
      ...(request.body && { data: request.body }),
    })

    if (cacheRequest && request.cache) {
      request.cache.set(cacheKey, { data })
    }

    response.setHeader('Cache-Control', 'no-cache')
    response.setHeader('X-Cache', 'MISS')

    return data
  }
)

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
              .json({ message: errorResponse?.data || 'Resource not found' })
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
