import { APIResponseError, ApiResponseType } from '../../types/requests/types'
import { formatRequestErrorMessage } from '../errorHandling/formatErrorMessage'
import { fetchWorkOrderFiltersRequest } from './workOrders'

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
