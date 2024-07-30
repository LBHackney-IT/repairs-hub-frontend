import cookie from 'cookie'
import axios from 'axios'
import * as HttpStatus from 'http-status-codes'
import { isAuthorised } from './googleAuth'
import { paramsSerializer } from './urls'
import { cache } from './middleware/cache'
import { CACHE_MAX_AGE_IN_SECONDS } from './helpers/cache'
import logger from 'loglevel'

// Sentry doesn't load the config for API routes automatically
import { Sentry } from '@/root/sentry.server.config'
import { ErrorWithResponse } from './types'
import { NextApiRequest, NextApiResponse } from 'next'

const {
  REPAIRS_SERVICE_API_URL,
  REPAIRS_SERVICE_API_KEY,
  GSSO_TOKEN_NAME,
  NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME,
  LOG_LEVEL,
  CONFIGURATION_API_URL,
} = process.env

logger.setLevel(logger.levels[LOG_LEVEL || 'INFO'])

export const externalAPIRequest = cache(
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

    const { path, ...queryParams } = request.query

    const api = axios.create()

    // Log request
    api.interceptors.request.use((request) => {
      logger.info(
        'Starting External API request:',
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
      logger.info(
        `External API response: ${response.status} ${
          response.statusText
        } ${JSON.stringify(response.data)}`
      )

      return response
    })

    try {
      const { data } = await api({
        method: request.method,
        headers,
        url: path?.join('/'),
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
    } catch (error) {
      const errorToThrow = new Error(error) as ErrorWithResponse

      errorToThrow.response = error.response
      throw errorToThrow
    }
  }
)

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

    const { path, ...queryParams } = request.query

    const api = axios.create()

    // Log request
    api.interceptors.request.use((request) => {
      logger.info(
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
      logger.info(
        `Service API response: ${response.status} ${
          response.statusText
        } ${JSON.stringify(response.data)}`
      )

      return response
    })

    try {
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
    } catch (error) {
      const errorToThrow = new Error(error) as ErrorWithResponse

      errorToThrow.response = error.response
      throw errorToThrow
    }
  }
)

export const configurationAPIRequest = async (request) => {
  const cookies = cookie.parse(request.headers.cookie ?? '')
  const token = cookies[GSSO_TOKEN_NAME]

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const api = axios.create()

  // Log request
  api.interceptors.request.use((request) => {
    logger.info(
      'Starting Configuration API request:',
      JSON.stringify({
        ...request,
        headers: {
          ...request.headers,
          Authorization: '[REMOVED]',
        },
      })
    )

    return request
  })

  // Log successful responses
  api.interceptors.response.use((response) => {
    logger.info(
      `Configuration API response: ${response.status} ${
        response.statusText
      } ${JSON.stringify(response.data)}`
    )

    return response
  })

  try {
    const { data } = await api({
      method: request.method,
      headers,
      url: `${CONFIGURATION_API_URL}/api/v1/configuration`,
      params: { types: 'RH' },
    })

    return data
  } catch (error) {
    const errorToThrow = new Error(error) as ErrorWithResponse

    errorToThrow.response = error.response
    throw errorToThrow
  }
}

export const authoriseServiceAPIRequest = (callBack) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const user = isAuthorised({ req })

      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Auth cookie missing.' })
      } else {
        Sentry.setUser({ name: user.name, email: user.email })
      }

      Sentry.configureScope((scope) => {
        scope.addEventProcessor((event) => {
          if (event.request?.cookies[GSSO_TOKEN_NAME]) {
            event.request.cookies[GSSO_TOKEN_NAME] = '[REMOVED]'
          }

          if (event.request?.cookies[NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME]) {
            event.request.cookies[NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME] =
              '[REMOVED]'
          }

          return event
        })
      })

      // Call the function defined in the API route
      return await callBack(req, res, user)
    } catch (error) {
      Sentry.captureException(error)

      const errorResponse = error.response
      if (errorResponse) {
        // The request was made and the server responded with a non-200 status
        logger.error(
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
        logger.error('Cannot connect to Service API')

        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'No response received from Service API' })
      } else {
        // Something happened in setting up the request that triggered an Error
        logger.error('API Client could not setup request', error.message)

        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'API Client request setup error' })
      }
    }
  }
}
