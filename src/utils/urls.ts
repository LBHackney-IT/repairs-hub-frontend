import qs from 'qs'

export const getProtocol = () => {
  return process.env.NODE_ENV === 'production' ? 'https' : 'http'
}

export const paramsSerializer = (params: any) => {
  return qs.stringify(params, { arrayFormat: 'repeat' })
}
