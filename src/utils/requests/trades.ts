import { APIResponseError, ApiResponseType } from '../../types/requests/types'
import { frontEndApiRequest } from '../frontEndApiClient/requests'

export type Trades = {
  key: string
  description: string
}

export const getTrades = async (): Promise<ApiResponseType<Trades[]>> => {
  try {
    const workOrderFilters = await frontEndApiRequest({
      method: 'get',
      path: '/api/filter/WorkOrder',
    })
    console.log(workOrderFilters)
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
          : `Oops, an error occurred: ${
              e.response?.status
            } with message: ${JSON.stringify(e.response?.data?.message)}`
      ),
    }
  }
}
