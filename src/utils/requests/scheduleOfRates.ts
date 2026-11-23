import { frontEndApiRequest } from '../frontEndApiClient/requests'
import { Priority } from '../../models/priority'
import { FOUR_HOURS, queryClient } from '../queryClient'

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

// Priorities never change, so keep them for the whole session. cacheTime has to
// match staleTime, as entries nothing is subscribed to are dropped after it
export const prioritiesQuery = () => ({
  queryKey: ['priorities'],
  queryFn: () =>
    frontEndApiRequest<Priority[]>({
      method: 'get',
      path: `/api/schedule-of-rates/priorities`,
    }),
  staleTime: FOUR_HOURS,
  cacheTime: FOUR_HOURS,
})

export const fetchPrioritiesRequest = () =>
  queryClient.fetchQuery(prioritiesQuery())

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
