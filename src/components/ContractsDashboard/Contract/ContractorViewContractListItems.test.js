import { render } from '@testing-library/react'
import MockDate from 'mockdate'
import {
  mockActiveContracts,
  mockInactiveContracts,
} from '../mockContractsData'
import { ContractorViewContractListItems } from './ContractorViewContractListItems'

describe('Contractors list items component', () => {
  beforeAll(() => {
    MockDate.set('2025-07-09')
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should render active contracts with relevant fields', async () => {
    const { asFragment } = render(
      <ContractorViewContractListItems
        contracts={mockActiveContracts}
        heading="Active Contracts:"
        warningText="No active contracts found for Syracuse Limited"
        page="contractor"
        activeStatus="active"
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render inactive contracts with relevant fields', async () => {
    const { asFragment } = render(
      <ContractorViewContractListItems
        contracts={mockInactiveContracts}
        heading="Inactive Contracts:"
        warningText="No inactive contracts found for Syracuse Limited"
        page="contractor"
        activeStatus="active"
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
