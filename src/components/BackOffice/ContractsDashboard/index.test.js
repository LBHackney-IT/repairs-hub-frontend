import { render } from '@testing-library/react'
import { useQuery } from 'react-query'
import MockDate from 'mockdate'

import ContractsDashboard from './index'
import { mockContracts, mockInactiveContracts } from './mockContractsData'

jest.mock('react-query', () => ({
  useQuery: jest.fn(),
}))

jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  today: new Date('2025-07-10'),
}))

describe('Contracts dashboard component', () => {
  it('should render the component', async () => {
    MockDate.set('2025-07-10T15:38:48.061Z')
    useQuery.mockImplementationOnce(() => ({
      data: mockContracts,
      isLoading: false,
      error: null,
    }))

    useQuery.mockImplementationOnce(() => ({
      data: mockInactiveContracts,
      isLoading: false,
      error: null,
    }))

    useQuery.mockImplementationOnce(() => ({
      data: [],
      isLoading: false,
      error: null,
    }))

    const { asFragment } = render(<ContractsDashboard />)

    expect(asFragment()).toMatchSnapshot()
    MockDate.reset()
  })
})
