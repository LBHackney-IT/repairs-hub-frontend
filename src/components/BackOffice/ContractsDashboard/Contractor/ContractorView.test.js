import { render } from '@testing-library/react'

import ContractorView from './ContractorView'

import { mockActiveContracts, mockInactiveContracts } from '../mockContracts'

jest.mock('react-query', () => ({
  useQuery: () => ({
    data: mockActiveContracts,
    isLoading: false,
    error: null,
  }),
}))

jest.mock('react-query', () => ({
  useQuery: () => ({
    data: mockInactiveContracts,
    isLoading: false,
    error: null,
  }),
}))

describe('Contracts dashboard component', () => {
  it('should render the component', async () => {
    const { asFragment } = render(<ContractorView contractorReference="SYC" />)

    expect(asFragment()).toMatchSnapshot()
  })
})
