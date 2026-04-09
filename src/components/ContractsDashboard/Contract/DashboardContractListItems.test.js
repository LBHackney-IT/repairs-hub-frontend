import { render } from '@testing-library/react'
import MockDate from 'mockdate'
import { filterActiveContractsByExpiryDate } from '../utils'
import { mockActiveContracts } from '../mockContractsData'
import { DashboardContractListItems } from './DashboardContractListItems'

describe('Contractors list items component', () => {
  beforeAll(() => {
    MockDate.set('2025-07-09')
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should render contracts that expire in two months with relevant fields', async () => {
    MockDate.set('2025-07-09T15:38:48.061Z')
    const contractsThatExpireInTwoMonths = filterActiveContractsByExpiryDate(
      mockActiveContracts,
      2,
      new Date('2025-07-09T15:38:48.061Z')
    )
    const { asFragment } = render(
      <DashboardContractListItems
        contracts={contractsThatExpireInTwoMonths}
        heading="Contracts due to expire soon:"
        warningText="No contracts expiring in the next two months."
        page="dashboard"
      />
    )
    expect(asFragment()).toMatchSnapshot()
    MockDate.reset()
  })
})
