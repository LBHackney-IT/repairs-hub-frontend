import { render } from '@testing-library/react'
import MockDate from 'mockdate'
import { DashboardContractListItem } from './DashboardContractListItem'

describe('Contractors list item component', () => {
  beforeAll(() => {
    MockDate.set('2025-07-09')
  })

  afterAll(() => {
    MockDate.reset()
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
        <DashboardContractListItem contract={mockContract} index={1} />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
