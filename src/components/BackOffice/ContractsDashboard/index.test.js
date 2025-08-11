import { render } from '@testing-library/react'

import ContractsDashboard from './index'
import { mockContracts } from './mockContractsData'

jest.mock('react-query', () => ({
  useQuery: () => ({
    data: mockContracts,
    isLoading: false,
    error: null,
  }),
}))

jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  today: new Date('2025-08-08'),
}))

describe('Contracts dashboard component', () => {
  it('should render the component', async () => {
    const { asFragment } = render(<ContractsDashboard />)

    expect(asFragment()).toMatchSnapshot()
  })
})
