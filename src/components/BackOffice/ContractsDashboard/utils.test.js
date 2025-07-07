import { mockContracts, mockInactiveContracts } from './mockContracts'
import {
  oneMonthInTheFuture,
  filterContractsByExpiryDate,
  twoMonthsago,
  filterRelativeInactiveContracts,
} from './utils'

describe('filter contracts by expiry date', () => {
  it('returns contracts that will expire in the next two months', () => {
    const contracts = mockContracts

    const response = filterContractsByExpiryDate(contracts, 2)

    expect(response).toStrictEqual([
      {
        contractReference: '126-126-1266',
        terminationDate: oneMonthInTheFuture.toISOString(),
        effectiveDate: '2024-03-26T00:00:00Z',
        contractorReference: 'AIM',
        contractorName: 'Aim Windows',
        isRaisable: true,
        sorCount: 118,
        sorCost: 52080.57,
      },
      {
        contractReference: '127-127-1277',
        terminationDate: oneMonthInTheFuture.toISOString(),
        effectiveDate: '2023-09-15T23:00:00Z',
        contractorReference: 'SCC',
        contractorName: 'Alphatrack (S) Systems Lt',
        isRaisable: true,
        sorCount: 0,
        sorCost: 0,
      },
    ])
  })
})

describe('relativeInactiveContracts', () => {
  it('should return all inactive contracts that expire after 2020', () => {
    const inactiveContracts = mockInactiveContracts
    const response = filterRelativeInactiveContracts(inactiveContracts, '2020')

    expect(response).toStrictEqual([
      {
        contractReference: '133-133-1388',
        terminationDate: twoMonthsago.toISOString(),
        effectiveDate: '2020-01-04T00:00:00Z',
        contractorReference: 'SYC',
        contractorName: 'Sycous Limited',
        isRaisable: true,
        sorCount: 20,
        sorCost: 5958.38,
      },
      {
        contractReference: '144-144-1444',
        terminationDate: twoMonthsago.toISOString(),
        effectiveDate: '2020-01-04T00:00:00Z',
        contractorReference: 'SYC',
        contractorName: 'Sycous Limited',
        isRaisable: true,
        sorCount: 20,
        sorCost: 5958.38,
      },
      {
        contractReference: '155-155-1555',
        terminationDate: twoMonthsago.toISOString(),
        effectiveDate: '2020-01-04T00:00:00Z',
        contractorReference: 'SYC',
        contractorName: 'Sycous Limited',
        isRaisable: true,
        sorCount: 20,
        sorCost: 5958.38,
      },
    ])
  })
})
