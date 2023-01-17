import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'

export const fetchContractors = async () => {
  return await frontEndApiRequest({
    method: 'get',
    path: '/api/contractors?getAllContractors=true',
  })
}

export const fetchTrades = async () => {
  return await frontEndApiRequest({
    method: 'get',
    path: '/api/schedule-of-rates/trades?getAllTrades=true',
  })
}

export const fetchContracts = async (contractorReference) => {
  return await frontEndApiRequest({
    method: 'get',
    path: `/api/backoffice/contracts?contractorReference=${contractorReference}`,
  })
}

export const saveSorCodesToDatabase = async (data) => {
  await frontEndApiRequest({
    method: 'post',
    path: `/api/backoffice/sor-codes`,
    requestData: data,
  })
}

export const dataToRequestObject = (csvArray, contractReference, tradeCode) => {
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
