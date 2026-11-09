import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as HttpStatus from 'http-status-codes'
import { getApiToken, getAuthenticatedUser } from './auth/auth'
import { paramsSerializer } from './urls'
import logger from 'loglevel'

const {
  REPAIRS_SERVICE_API_URL,
  REPAIRS_SERVICE_API_KEY,
  LOG_LEVEL,
} = process.env

logger.setLevel(logger.levels[LOG_LEVEL || 'INFO'])

export type AuthenticatedUser = NonNullable<
  Awaited<ReturnType<typeof getAuthenticatedUser>>
>

type ApiRouteHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser
) => unknown

// What axios (or the wrapped Error from `apiRequest`) gives us on failure
type ApiError = Error & {
  response?: AxiosResponse
  request?: unknown
}

const apiRequest = async (
  request: NextApiRequest,
  {
    label,
    buildUrl,
  }: {
    label: string
    buildUrl: (path: string[]) => string
  }
) => {
  const token = await getApiToken(request)

  const headers = {
    'x-api-key': REPAIRS_SERVICE_API_KEY,
    'x-hackney-user': token,
    Authorization: token,
    'Content-Type': 'application/json',
  }

  // Catch-all routes (and the routes that set `path` themselves) give string[]
  const { path, ...queryParams } = request.query as {
    path?: string[]
    [key: string]: string | string[]
  }

  const url = buildUrl(path)

  try {
    const { data, status } = await axios({
      method: request.method,
      headers,
      url,
      params: queryParams,
      paramsSerializer,
      ...(request.body && { data: request.body }),
    })

    // Method, URL and status only: no headers, params, or bodies
    logger.info(`${label} ${request.method} ${url}: ${status}`)

    return data
  } catch (error) {
    const errorToThrow: ApiError = new Error(error)

    errorToThrow.response = error.response
    throw errorToThrow
  }
}

export const externalAPIRequest = (request: NextApiRequest) =>
  apiRequest(request, {
    label: 'External API',
    buildUrl: (path) => path?.join('/'),
  })

export const serviceAPIRequest = (request: NextApiRequest) =>
  apiRequest(request, {
    label: 'Service API',
    buildUrl: (path) => `${REPAIRS_SERVICE_API_URL}/${path?.join('/')}`,
  })

export const authoriseServiceAPIRequest = (callBack: ApiRouteHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const user = await getAuthenticatedUser(req)

      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Auth cookie missing.' })
      }

      // Call the function defined in the API route
      return await callBack(req, res, user)
    } catch (error) {
      const apiError: ApiError = error
      const errorResponse = apiError.response

      if (errorResponse) {
        const target = `${errorResponse.request?.method} ${errorResponse.request?.path}`
        logger.error(
          `Service API response for ${target} ERROR`,
          JSON.stringify({
            status: errorResponse?.status,
            data: errorResponse?.data,
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
      } else if (apiError.request) {
        logger.error('Cannot connect to Service API')
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'No response received from Service API' })
      } else {
        logger.error('API Client could not setup request', apiError.message)
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'API Client request setup error' })
      }
    }
  }
}
