import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'

export const fetchContractors = () =>
  new Promise(async (resolve) => {
    const contractors = await frontEndApiRequest({
      method: 'get',
      path: '/api/contractors?getAllContractors=true',
    })

    resolve(contractors)
  })

export const fetchTrades = () =>
  new Promise(async (resolve) => {
    const trades = await frontEndApiRequest({
      method: 'get',
      path: '/api/schedule-of-rates/trades?getAllTrades=true',
    })

    resolve(trades)
  })

export const fetchContracts = (contractorReference) =>
  new Promise(async (resolve) => {
    const contracts = await frontEndApiRequest({
      method: 'get',
      path: `/api/backoffice/contracts?contractorReference=${contractorReference}`,
    })

    resolve(contracts)
  })

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
    contract: 'placeholder',
  }
}
