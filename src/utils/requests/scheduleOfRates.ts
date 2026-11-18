import { frontEndApiRequest } from '../frontEndApiClient/requests'

export const fetchSorCodesRequest = (params: object) =>
  frontEndApiRequest({
    method: 'get',
    path: '/api/schedule-of-rates/codes',
    params,
  })

export const fetchPrioritiesRequest = () =>
  frontEndApiRequest({
    method: 'get',
    path: `/api/schedule-of-rates/priorities`,
  })

export const fetchTradesForPropertyRequest = (propertyReference: string) =>
  frontEndApiRequest({
    method: 'get',
    path: `/api/schedule-of-rates/trades?propRef=${propertyReference}`,
  })

export const checkSorCodesRequest = (params: object, paramsSerializer?: any) =>
  frontEndApiRequest({
    method: 'get',
    path: '/api/schedule-of-rates/check',
    params,
    ...(paramsSerializer && { paramsSerializer }),
  })
