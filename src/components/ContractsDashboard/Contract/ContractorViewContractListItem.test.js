import { render } from '@testing-library/react'
import MockDate from 'mockdate'
import { mockActiveContracts } from '../mockContractsData'
import { ContractorViewContractListItem } from './ContractorViewContractListItem'

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
        <ContractorViewContractListItem contract={mockContract} index={1} />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
