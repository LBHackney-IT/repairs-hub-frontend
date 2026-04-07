import { render } from '@testing-library/react'
import MockDate from 'mockdate'
import { mockInactiveContracts } from '../mockContractsData'
import { SorSearchContractListItem } from './SorSearchContractListItem'

describe('Contractors list item component', () => {
  beforeAll(() => {
    MockDate.set('2025-07-09')
  })

  afterAll(() => {
    MockDate.reset()
  })

  describe('sorSearch', () => {
    it('should render a contract that has the sor code in it with relevant fields', () => {
      const mockContract = mockInactiveContracts[4]
      const { asFragment } = render(
        <SorSearchContractListItem contract={mockContract} index={1} />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
