import { render } from '@testing-library/react'

import ContractorView from './ContractorView'

import {
  mockActiveContracts,
  mockInactiveContracts,
  mockSorCodeContracts,
} from '../mockContractsData'

jest.mock('react-query', () => ({
  useQuery: jest.fn(),
}))

import { useQuery } from 'react-query'

describe('Contracts dashboard component', () => {
  beforeEach(() => {
    useQuery.mockImplementation((key) => {
      const queryKey = Array.isArray(key) ? key[0] : key

      switch (queryKey) {
        case 'activeContracts':
          return {
            data: mockActiveContracts,
            isLoading: false,
            error: null,
          }
        case 'inactiveContracts':
          return {
            data: mockInactiveContracts,
            isLoading: false,
            error: null,
          }
        default:
          return {
            data: null,
            isLoading: false,
            error: null,
          }
      }
    })
  })
  it('should render the component', async () => {
    const { asFragment } = render(<ContractorView contractorReference="SYC" />)
    expect(asFragment()).toMatchSnapshot()
  })
})
