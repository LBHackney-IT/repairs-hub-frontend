import { frontEndApiRequest } from '../../frontEndApiClient/requests'
import type { Trade } from '../../../components/BackOffice/AddSORCodes/useSelectTrade'

export const fetchTrades = async (): Promise<Trade[]> => {
  return await frontEndApiRequest({
    method: 'get',
    path: '/api/schedule-of-rates/trades?getAllTrades=true',
  })
}
