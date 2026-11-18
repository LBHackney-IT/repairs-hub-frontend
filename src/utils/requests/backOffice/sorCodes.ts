import { frontEndApiRequest } from '../../frontEndApiClient/requests'
import type SorCode from '../../../models/sorCode'

export interface SaveSorCodesData {
  sorCodes: SorCode[]
  contractReference: string
  tradeCode: string
}

export const saveSorCodesToDatabaseRequest = async (data: SaveSorCodesData) => {
  await frontEndApiRequest({
    method: 'post',
    path: `/api/backoffice/sor-codes`,
    requestData: data,
  })
}
