import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'

export const csvFileToArray = (string) => {
  const csvHeader = string.slice(0, string.indexOf('\n')).trim().split(',')
  const csvRows = string
    .slice(string.indexOf('\n') + 1)
    .trim()
    .split('\n')

  const array = csvRows.map((i) => {
    const values = i.split(',')
    const obj = csvHeader.reduce((object, header, index) => {
      object[header] = values[index]
      return object
    }, {})

    return obj
  })

  return array
}

export const fetchContractors = () =>
  new Promise(async (resolve) => {
    const contractors = await frontEndApiRequest({
      method: 'get',
      path: '/api/contractors?propertyReference=00023402&tradeCode=CA',
    })

    resolve(contractors)
  })

export const fetchTrades = () =>
  new Promise(async (resolve) => {
    const trades = await frontEndApiRequest({
      method: 'get',
      path: '/api/schedule-of-rates/trades?propRef=00023402',
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
