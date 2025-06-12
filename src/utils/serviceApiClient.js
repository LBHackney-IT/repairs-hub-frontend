import cookie from 'cookie'
import axios from 'axios'
import * as HttpStatus from 'http-status-codes'
import { isAuthorised } from './googleAuth'
import { paramsSerializer } from './urls'
import logger from 'loglevel'

// Sentry doesn't load the config for API routes automatically
import { Sentry } from '@/root/sentry.server.config'

const {
  REPAIRS_SERVICE_API_URL,
  REPAIRS_SERVICE_API_KEY,
  GSSO_TOKEN_NAME,
  NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME,
  LOG_LEVEL,
  CONFIGURATION_API_URL,
} = process.env

logger.setLevel(logger.levels[LOG_LEVEL || 'INFO'])

export const externalAPIRequest = async (request) => {
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

    return data
  } catch (error) {
    const errorToThrow = new Error(error)

    errorToThrow.response = error.response
    throw errorToThrow
  }
}

export const serviceAPIRequest = async (request) => {
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
    const target = `${response.request?.method} ${response.request?.path}`
    const data = JSON.stringify(response.data)
    const dataLength = Array.isArray(response.data)
      ? `(${response.data.length} items)`
      : ''
    logger.info(
      `Service API response for ${target}: ${response.status} ${dataLength} ${data}`
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

    return data
  } catch (error) {
    const errorToThrow = new Error(error)

    errorToThrow.response = error.response
    throw errorToThrow
  }
}

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
    const errorToThrow = new Error(error)

    errorToThrow.response = error.response
    throw errorToThrow
  }
}

export const authoriseServiceAPIRequest = (callBack) => {
  return async (req, res) => {
    try {
      const user = isAuthorised({ req })

      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Auth cookie missing.' })
      } else {
        Sentry.setUser({ name: user.name, email: user.email })
      }

      // Configure cookie removal in Sentry scope
      Sentry.getCurrentScope().addEventProcessor((event) => {
        if (event.request?.cookies[GSSO_TOKEN_NAME])
          event.request.cookies[GSSO_TOKEN_NAME] = '[REMOVED]'

        if (event.request?.cookies[NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME])
          event.request.cookies[NEXT_PUBLIC_DRS_SESSION_COOKIE_NAME] =
            '[REMOVED]'

        return event
      })

      // Call the function defined in the API route
      return await callBack(req, res, user)
    } catch (error) {
      const errorResponse = error.response

      const categorizeError = (error) => {
        if (errorResponse?.status) {
          return {
            category: 'api_error',
            statusCode: errorResponse.status,
            type: HttpStatus.getStatusText(errorResponse.status),
          }
        } else if (error.request) {
          return {
            category: 'network_error',
            statusCode: 0,
            type: 'CONNECTION_FAILURE',
          }
        } else {
          return {
            category: 'setup_error',
            statusCode: -1,
            type: 'CLIENT_SETUP_ERROR',
          }
        }
      }

      const errorCategory = categorizeError(error)

      Sentry.withScope((scope) => {
        // Add error metadata
        scope.setTag('error.category', errorCategory.category)
        scope.setTag('error.status_code', errorCategory.statusCode)
        scope.setTag('error.type', errorCategory.type)
        scope.setContext('request', {
          path: req.path,
          method: req.method,
          query: req.query,
        })

        scope.setFingerprint([
          errorCategory.category,
          errorCategory.statusCode.toString(),
          errorCategory.type,
        ])

        if (errorResponse) {
          scope.setContext('api_response', {
            status: errorResponse.status,
            statusText: errorResponse.statusText,
            data: errorResponse.data,
          })
        }
      })

      Sentry.captureException(error, {
        level: errorResponse?.status >= 500 ? 'error' : 'warning',
      })

      if (errorResponse) {
        const target = `${errorResponse.request?.method} ${errorResponse.request?.path}`
        logger.error(
          `Service API response for ${target} ERROR`,
          JSON.stringify({
            status: errorResponse?.status,
            data: errorResponse?.data,
            headers: errorResponse?.headers,
          })
        )

        if (errorResponse?.status === HttpStatus.NOT_FOUND) {
          res
            .status(HttpStatus.NOT_FOUND)
            .json({ message: errorResponse?.data || 'Resource not found' })
        } else {
          res
            .status(errorResponse?.status)
            .json({ message: errorResponse?.data || 'Service API error' })
        }
      } else if (error.request) {
        logger.error('Cannot connect to Service API')
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'No response received from Service API' })
      } else {
        logger.error('API Client could not setup request', error.message)
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'API Client request setup error' })
      }
    }
  }
}
