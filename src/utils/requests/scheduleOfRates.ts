import { frontEndApiRequest } from '../frontEndApiClient/requests'
import { Priority } from '../../models/priority'

export interface SorCodesParams {
  tradeCode: string
  propertyReference: string
  contractorReference: string
  isRaisable?: boolean
  showAdditionalTrades?: boolean
  showAllTrades?: boolean
  filter?: string
}

export interface CheckSorCodesParams {
  tradeCode: string
  propertyReference: string
  contractorReference: string
  sorCode: string[]
  isRaisable: boolean
}

export const fetchSorCodesRequest = (params: SorCodesParams) =>
  frontEndApiRequest({
    method: 'get',
    path: '/api/schedule-of-rates/codes',
    params,
  })

export const fetchPrioritiesRequest = () =>
  frontEndApiRequest<Priority[]>({
    method: 'get',
    path: `/api/schedule-of-rates/priorities`,
  })

export const fetchTradesForPropertyRequest = (propertyReference: string) =>
  frontEndApiRequest({
    method: 'get',
    path: `/api/schedule-of-rates/trades?propRef=${propertyReference}`,
  })

export const checkSorCodesRequest = (
  params: CheckSorCodesParams,
  paramsSerializer?: any
) =>
  frontEndApiRequest({
    method: 'get',
    path: '/api/schedule-of-rates/check',
    params,
    ...(paramsSerializer && { paramsSerializer }),
  })
