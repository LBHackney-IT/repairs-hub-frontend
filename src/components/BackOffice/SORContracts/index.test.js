jest.mock('react-query', () => ({
  QueryClient: jest.fn(),
  QueryClientProvider: ({ children }) => children,
  useQuery: () => ({
    data: [],
    isLoading: false,
    error: null,
  }),
}))
import { render } from '@testing-library/react'
import SORContracts from './index'

describe('SORContracts component', () => {
  it('should render the component', async () => {
    const { asFragment } = render(<SORContracts />)

    expect(asFragment()).toMatchSnapshot()
  })
})
