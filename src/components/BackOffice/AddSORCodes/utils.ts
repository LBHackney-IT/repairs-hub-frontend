import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'

import { Contractor, Trade, NewSorCodesRequestObject } from './types'

export const fetchContractors = async () : Promise<Array<Contractor>>  => {
  return await frontEndApiRequest({
    method: 'get',
    path: '/api/contractors?getAllContractors=true',
    params: null,
    paramsSerializer: null,
    requestData: null
  })
}

export const fetchTrades = async () : Promise<Array<Trade>> => {
  return await frontEndApiRequest({
    method: 'get',
    path: '/api/schedule-of-rates/trades?getAllTrades=true',
    params: null,
    paramsSerializer: null,
    requestData: null
  })
}

export const fetchContracts = async (contractorReference: string) : Promise<Array<string>> => {
  return await frontEndApiRequest({
    method: 'get',
    path: `/api/backoffice/contracts?contractorReference=${contractorReference}`,
    params: null,
    paramsSerializer: null,
    requestData: null
  })
}

export const saveSorCodesToDatabase = async (data: NewSorCodesRequestObject): Promise<void> => {
  await frontEndApiRequest({
    method: 'post',
    path: `/api/backoffice/sor-codes`,
    requestData: data,
    params: null,
    paramsSerializer: null,
  })
}

export const dataToRequestObject = (csvArray: Array<any>, contractReference: string, tradeCode: string): NewSorCodesRequestObject => {
  const sorCodes = csvArray.map((x) => ({
    code: x.Code,
    cost: parseFloat(x.Cost),
    standardMinuteValue: parseFloat(x.StandardMinuteValue),
    shortDescription: x.ShortDescription,
    longDescription: x.LongDescription,
  }))

  return {
    contractReference: contractReference,
    tradeCode: tradeCode,
    sorCodes: sorCodes,
  }
}
