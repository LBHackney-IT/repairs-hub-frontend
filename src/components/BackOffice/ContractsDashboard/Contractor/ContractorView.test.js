import { render } from '@testing-library/react'

import ContractorView from './ContractorView'

const today = new Date()

const twoMonthsago = new Date(
  today.getFullYear(),
  today.getMonth() - 2,
  today.getDate()
)

const sixMonthsInTheFuture = new Date(
  today.getFullYear(),
  today.getMonth() + 6,
  today.getDate()
)

const mockActiveContracts = [
  {
    contractReference: '127-127-1277',
    terminationDate: sixMonthsInTheFuture.toISOString(),
    effectiveDate: '2023-09-15T23:00:00Z',
    contractorReference: 'SYC',
    contractorName: 'Sycous Limited',
    isRaisable: true,
    sorCount: 0,
    sorCost: 0,
  },

  {
    contractReference: '128-128-1288',
    terminationDate: sixMonthsInTheFuture.toISOString(),
    effectiveDate: '2024-01-04T00:00:00Z',
    contractorReference: 'SYC',
    contractorName: 'Sycous Limited',
    isRaisable: true,
    sorCount: 34,
    sorCost: 5958.38,
  },
  {
    contractReference: '129-129-1299',
    terminationDate: sixMonthsInTheFuture.toISOString(),
    effectiveDate: '2024-08-01T00:00:00Z',
    contractorReference: 'SYC',
    contractorName: 'Sycous Limited',
    isRaisable: true,
    sorCount: 3441,
    sorCost: 544898.23,
  },
  {
    contractReference: '130-130-1300',
    terminationDate: sixMonthsInTheFuture.toISOString(),
    effectiveDate: '2024-08-01T00:00:00Z',
    contractorReference: 'SYC',
    contractorName: 'Sycous Limited',
    isRaisable: true,
    sorCount: 3443,
    sorCost: 573623.97,
  },
  {
    contractReference: '131-131-1311',
    terminationDate: sixMonthsInTheFuture.toISOString(),
    effectiveDate: '2022-09-18T23:00:00Z',
    contractorReference: 'SYC',
    contractorName: 'Sycous Limited',
    isRaisable: true,
    sorCount: 904,
    sorCost: 143393.57,
  },
  {
    contractReference: '132-132-1322',
    terminationDate: sixMonthsInTheFuture.toISOString(),
    effectiveDate: '2024-03-26T00:00:00Z',
    contractorReference: 'SYC',
    contractorName: 'Sycous Limited',
    isRaisable: true,
    sorCount: 2,
    sorCost: 56.74,
  },
]

const mockInactiveContracts = [
  {
    contractReference: '111-111-1111',
    terminationDate: '2015-03-31T00:00:00Z',
    effectiveDate: '2012-04-01T00:00:00Z',
    contractorReference: 'SYC',
    contractorName: 'Sycous Limited',
    isRaisable: true,
    sorCount: 20,
    sorCost: 5958.38,
  },
  {
    contractReference: '122-122-1222',
    terminationDate: '2015-03-31T00:00:00Z',
    effectiveDate: '2012-04-01T00:00:00Z',
    contractorReference: 'SYC',
    contractorName: 'Sycous Limited',
    isRaisable: true,
    sorCount: 20,
    sorCost: 5958.38,
  },
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
]

jest.mock('react-query', () => ({
  useQuery: () => ({
    data: mockActiveContracts,
    isLoading: false,
    error: null,
  }),
}))

jest.mock('react-query', () => ({
  useQuery: () => ({
    data: mockInactiveContracts,
    isLoading: false,
    error: null,
  }),
}))

describe('Contracts dashboard component', () => {
  it('should render the component', async () => {
    const { asFragment } = render(<ContractorView contractorReference="SYC" />)

    expect(asFragment()).toMatchSnapshot()
  })

  describe('relativeInactiveContracts', () => {
    it('should return all inactive contracts that expire after 2020', () => {
      const response = mockInactiveContracts.filter(
        (contract) =>
          contract.terminationDate > '2020' &&
          contract.terminationDate < new Date().toISOString()
      )

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
})
