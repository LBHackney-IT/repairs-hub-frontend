import { render } from '@testing-library/react'

import ContractsDashboard from './index'
import { mockContracts } from '.mockContracts'

jest.mock('react-query', () => ({
  useQuery: () => ({
    data: mockContracts,
    isLoading: false,
    error: null,
  }),
}))

describe('Contracts dashboard component', () => {
  it('should render the component', async () => {
    const { asFragment } = render(<ContractsDashboard />)

    expect(asFragment()).toMatchSnapshot()
  })
})
