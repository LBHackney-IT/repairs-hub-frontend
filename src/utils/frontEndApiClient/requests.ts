import axios, { AxiosRequestConfig, Method } from 'axios'

// Only relative paths to this app's own /api routes may be requested, so that
// user-controlled values interpolated into a path can't redirect the request.
const getSafeInternalApiPath = (path: string): string => {
  if (typeof path !== 'string') throw new Error('Invalid request path')

  const trimmedPath = path.trim()
  const [pathname] = trimmedPath.split(/[?#]/)

  let decodedPathname: string
  try {
    decodedPathname = decodeURIComponent(pathname)
  } catch {
    throw new Error('Unsafe request path')
  }

  const isUnsafe =
    !trimmedPath.startsWith('/api/') ||
    decodedPathname.includes('\\') ||
    decodedPathname.includes('//') ||
    decodedPathname.split('/').some((segment) => segment === '..') ||
    /%2e|%2f|%5c/i.test(pathname)

  if (isUnsafe) throw new Error('Unsafe request path')

  return trimmedPath
}

export const frontEndApiRequest = async <T = any>({
  method,
  path,
  params = null,
  requestData,
  paramsSerializer,
  timeout,
}: {
  method: Method
  path: string
  params?: object
  requestData?: object
  paramsSerializer?: any
  timeout?: number
}): Promise<T> => {
  const config: AxiosRequestConfig = {
    method: method,
    url: getSafeInternalApiPath(path),
    timeout,
    ...(requestData && { data: requestData }),
    ...(paramsSerializer && { paramsSerializer }),
  }

  if (params) {
    config.params = params
  }

  const { data } = await axios(config)

  return data
}
