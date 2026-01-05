import { render, fireEvent, act, screen } from '@testing-library/react'

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
  it('should render the component without displaying sor contracts', async () => {
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
    const { asFragment } = render(<ContractorView contractorReference="SYC" />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render component with sor code contracts displayed', async () => {
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
        case 'sorContracts':
          return {
            data: mockSorCodeContracts,
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

    const { asFragment } = await act(() =>
      render(<ContractorView contractorReference="SYC" />)
    )

    await act(() =>
      fireEvent.change(screen.getByTestId('input-search'), {
        target: { value: 'ABC123' },
      })
    )
    await act(() => fireEvent.click(screen.getByTestId('submit-search')))

    expect(asFragment()).toMatchSnapshot()
  })
})
