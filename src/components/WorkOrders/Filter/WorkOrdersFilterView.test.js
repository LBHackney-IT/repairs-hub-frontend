import { render, screen, waitFor } from '@testing-library/react'
import UserContext from '../../UserContext'
import WorkOrdersFilterView from './WorkOrdersFilterView'
import { contractManager } from 'factories/contract_manager'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'

jest.mock('@/utils/frontEndApiClient/requests')

const filters = {
  Priority: [{ key: '1', description: 'Immediate' }],
  Status: [{ key: '80', description: 'In Progress' }],
  Trades: [{ key: 'EL', description: 'Electrical' }],
  Contractors: [{ key: 'AVP', description: 'Avonline Network (A) Ltd' }],
}

describe('WorkOrdersFilterView component', () => {
  const view = (appliedFilters = {}) => (
    <UserContext.Provider value={{ user: contractManager }}>
      <WorkOrdersFilterView
        onFilterSubmit={jest.fn()}
        appliedFilters={appliedFilters}
        clearFilters={jest.fn()}
        onFilterRemove={jest.fn()}
      />
    </UserContext.Provider>
  )

  beforeEach(() => {
    frontEndApiRequest.mockReset()
  })

  it('shows the fetched filter options', async () => {
    frontEndApiRequest.mockResolvedValue(filters)

    render(view())

    await waitFor(() =>
      expect(screen.getByTestId('StatusCode.80')).toBeInTheDocument()
    )
    expect(frontEndApiRequest).toHaveBeenCalledWith({
      method: 'get',
      path: '/api/filter/WorkOrder',
    })
  })

  it('keeps the selected filter tags in step with the applied filters', async () => {
    frontEndApiRequest.mockResolvedValue(filters)

    const { rerender } = render(view())
    await waitFor(() => screen.getByTestId('StatusCode.80'))
    expect(screen.queryByLabelText('Remove In Progress filter')).toBeNull()

    rerender(view({ StatusCode: ['80'] }))

    expect(
      screen.getByLabelText('Remove In Progress filter')
    ).toBeInTheDocument()
  })

  it('shows an error and no filters when the request fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    frontEndApiRequest.mockRejectedValue({ response: { status: 500 } })

    render(view())

    expect(
      await screen.findByText(/Oops an error occurred with error status: 500/)
    ).toBeInTheDocument()
    expect(screen.queryByText('Filters')).not.toBeInTheDocument()
    console.error.mockRestore()
  })
})
