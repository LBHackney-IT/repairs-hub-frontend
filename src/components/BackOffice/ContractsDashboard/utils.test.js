import {
  ninthOfJulyTwentyTwentyFive,
  mockContracts,
  mockInactiveContracts,
} from './mockContractsData'
import {
  monthsOffset,
  filterActiveContractsByExpiryDate,
  filterInactiveContractsByExpiryDate,
  filterRelativeInactiveContracts,
} from './utils'

describe('filter active contracts by expiry date', () => {
  it('returns contracts that will expire in the next two months', () => {
    const contracts = mockContracts

    const response = filterActiveContractsByExpiryDate(
      contracts,
      2,
      ninthOfJulyTwentyTwentyFive
    )

    expect(response).toStrictEqual([
      {
        contractReference: '126-126-1266',
        terminationDate: monthsOffset(
          1,
          ninthOfJulyTwentyTwentyFive
        ).toISOString(),
        effectiveDate: '2024-03-26T00:00:00Z',
        contractorReference: 'AIM',
        contractorName: 'Aim Windows',
        isRaisable: true,
        sorCount: 118,
        sorCost: 52080.57,
      },
      {
        contractReference: '127-127-1277',
        terminationDate: monthsOffset(
          1,
          ninthOfJulyTwentyTwentyFive
        ).toISOString(),
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

describe('filter inactive contracts by expiry date', () => {
  it('returns contracts that have expired in the last month', () => {
    const contracts = mockInactiveContracts

    const response = filterInactiveContractsByExpiryDate(
      contracts,
      -1,
      ninthOfJulyTwentyTwentyFive
    )

    expect(response).toStrictEqual([
      {
        contractReference: '166-166-16666',
        terminationDate: '2025-07-08T00:00:00Z',
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

describe('relativeInactiveContracts', () => {
  it('should return all inactive contracts that expire after 2020', () => {
    const inactiveContracts = mockInactiveContracts
    const response = filterRelativeInactiveContracts(inactiveContracts, '2020')

    expect(response).toStrictEqual([
      {
        contractReference: '133-133-1388',
        terminationDate: monthsOffset(
          -2,
          ninthOfJulyTwentyTwentyFive
        ).toISOString(),
        effectiveDate: '2020-01-04T00:00:00Z',
        contractorReference: 'SYC',
        contractorName: 'Sycous Limited',
        isRaisable: true,
        sorCount: 20,
        sorCost: 5958.38,
      },
      {
        contractReference: '144-144-1444',
        terminationDate: monthsOffset(
          -2,
          ninthOfJulyTwentyTwentyFive
        ).toISOString(),
        effectiveDate: '2020-01-04T00:00:00Z',
        contractorReference: 'SYC',
        contractorName: 'Sycous Limited',
        isRaisable: true,
        sorCount: 20,
        sorCost: 5958.38,
      },
      {
        contractReference: '155-155-1555',
        terminationDate: monthsOffset(
          -2,
          ninthOfJulyTwentyTwentyFive
        ).toISOString(),
        effectiveDate: '2020-01-04T00:00:00Z',
        contractorReference: 'SYC',
        contractorName: 'Sycous Limited',
        isRaisable: true,
        sorCount: 20,
        sorCost: 5958.38,
      },
      {
        contractReference: '166-166-16666',
        terminationDate: '2025-07-08T00:00:00Z',
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
