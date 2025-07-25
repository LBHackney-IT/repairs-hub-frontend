import { render } from '@testing-library/react'

import { filterContractsByExpiryDate } from '../utils'

import ContractListItems from './ContractListItems'

import {
  mockActiveContracts,
  mockInactiveContracts,
} from '../mockContractsData'

describe('Contractors list items component', () => {
  it('should render active contracts with relevant fields', async () => {
    const { asFragment } = render(
      <ContractListItems
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
      <ContractListItems
        contracts={mockInactiveContracts}
        heading="Inactive Contracts:"
        warningText="No inactive contracts found for Syracuse Limited"
        page="contractor"
        activeStatus="active"
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render contracts that expire in two months with relevant fields', async () => {
    const contractsThatExpireInTwoMonths = filterContractsByExpiryDate(
      mockActiveContracts,
      2,
      new Date('2025-07-09T15:38:48.061Z')
    )
    const { asFragment } = render(
      <ContractListItems
        contracts={contractsThatExpireInTwoMonths}
        heading="Contracts due to expire soon:"
        warningText="No contracts expiring in the next two months."
        page="dashboard"
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
