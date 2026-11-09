import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import type SorCode from '@/root/src/models/sorCode'
import type { Trade } from './useSelectTrade'

export interface SaveSorCodesData {
  sorCodes: SorCode[]
  contractReference: string
  tradeCode: string
}

export const fetchTrades = async (): Promise<Trade[]> => {
  return await frontEndApiRequest({
    method: 'get',
    path: '/api/schedule-of-rates/trades?getAllTrades=true',
  })
}

export const saveSorCodesToDatabase = async (data: SaveSorCodesData) => {
  await frontEndApiRequest({
    method: 'post',
    path: `/api/backoffice/sor-codes`,
    requestData: data,
  })
}
