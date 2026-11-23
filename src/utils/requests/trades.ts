import { APIResponseError, ApiResponseType } from '../../types/requests/types'
import { formatRequestErrorMessage } from '../errorHandling/formatErrorMessage'
import { frontEndApiRequest } from '../frontEndApiClient/requests'
import { FOUR_HOURS, queryClient } from '../queryClient'

export const workOrderFiltersQuery = () => ({
  queryKey: ['workOrderFilters'],
  queryFn: () =>
    frontEndApiRequest({
      method: 'get',
      path: '/api/filter/WorkOrder',
    }),
  staleTime: FOUR_HOURS,
  cacheTime: FOUR_HOURS,
})

export const fetchWorkOrderFiltersRequest = () =>
  queryClient.fetchQuery(workOrderFiltersQuery())

export type TradeFilter = {
  key: string
  description: string
}

export const getTradeFiltersRequest = async (): Promise<
  ApiResponseType<TradeFilter[]>
> => {
  try {
    const workOrderFilters = await fetchWorkOrderFiltersRequest()
    return {
      success: true,
      response: workOrderFilters.Trades,
      error: null,
    }
  } catch (e) {
    console.error('An error has occured:', e.response)
    return {
      success: false,
      response: null,
      error: new APIResponseError(
        e.response?.status === 400
          ? `Invalid request data`
          : formatRequestErrorMessage(e)
      ),
    }
  }
}
