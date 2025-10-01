import { render } from '@testing-library/react'
import MockDate from 'mockdate'

import ContractListItem from './ContractListItem'

import {
  mockActiveContracts,
  mockInactiveContracts,
} from '../mockContractsData'

describe('Contractors list item component', () => {
  beforeAll(() => {
    MockDate.set('2025-07-09')
  })

  afterAll(() => {
    MockDate.reset()
  })

  describe('Contractor page', () => {
    it('should render a contract with relevant fields', async () => {
      const mockContract = mockActiveContracts[0]
      const { asFragment } = render(
        <ContractListItem contract={mockContract} index={1} page="contractor" />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
  describe('Dashboard page', () => {
    it('should render a contract that expires within two months with relevant fields', () => {
      const mockContract = {
        contractReference: '127-127-1277',
        terminationDate: '2025-08-09T15:38:48.061Z',
        effectiveDate: '2023-09-15T23:00:00Z',
        contractorReference: 'SYC',
        contractorName: 'Sycous Limited',
        isRaisable: true,
        sorCount: 0,
        sorCost: 0,
      }
      const { asFragment } = render(
        <ContractListItem contract={mockContract} index={1} page="dashboard" />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
  describe('sorSearch', () => {
    it('should render a contract that has the sor code in it with relevant fields', () => {
      const mockContract = mockInactiveContracts[4]
      const { asFragment } = render(
        <ContractListItem contract={mockContract} index={1} page="sorSearch" />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
