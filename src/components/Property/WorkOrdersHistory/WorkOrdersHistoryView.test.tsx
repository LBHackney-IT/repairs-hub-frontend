import { render, screen } from '@testing-library/react'
import WorkOrdersHistoryView from './WorkOrdersHistoryView'
import { useWorkOrdersHistory } from '@/requests/hooks/useWorkOrdersHistory'
import { WorkOrder } from '@/models/workOrder'

jest.mock('@/requests/hooks/useWorkOrdersHistory')

// The table has its own tests, so stand in for it here
jest.mock('./WorkOrdersHistoryTable', () => ({
  __esModule: true,
  default: ({ workOrders }) => (
    <div data-testid="work-orders-history-table">
      {workOrders.length} work orders
    </div>
  ),
}))

const mockUseWorkOrdersHistory = useWorkOrdersHistory as jest.Mock

const workOrders = [
  new WorkOrder({ reference: 10000012 }),
  new WorkOrder({ reference: 10000013 }),
]

const mockHistory = (
  overrides: Partial<ReturnType<typeof useWorkOrdersHistory>> = {}
) =>
  mockUseWorkOrdersHistory.mockReturnValue({
    workOrders: [],
    isLoading: false,
    error: null,
    hasMore: false,
    loadMore: jest.fn(),
    ...overrides,
  })

const renderView = () =>
  render(
    <WorkOrdersHistoryView
      propertyReference="00012345"
      tabName="Work orders history"
    />
  )

const NO_WORK_ORDERS = 'There are no historical repairs for this property.'

describe('WorkOrdersHistoryView component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('shows a spinner while loading', () => {
    mockHistory({ isLoading: true })

    renderView()

    expect(
      screen.getByText('Fetching work orders history…')
    ).toBeInTheDocument()
    expect(
      screen.queryByTestId('work-orders-history-table')
    ).not.toBeInTheDocument()
  })

  it('shows a message when there are no work orders', () => {
    mockHistory()

    renderView()

    expect(screen.getByText(NO_WORK_ORDERS)).toBeInTheDocument()
    expect(
      screen.queryByTestId('work-orders-history-table')
    ).not.toBeInTheDocument()
  })

  it('shows the error message, without the no work orders message, when the request fails', () => {
    mockHistory({ error: 'Could not load work orders' })

    renderView()

    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Could not load work orders'
    )
    expect(screen.queryByText(NO_WORK_ORDERS)).not.toBeInTheDocument()
  })

  it('shows the table of work orders', () => {
    mockHistory({ workOrders })

    renderView()

    expect(screen.getByTestId('work-orders-history-table')).toHaveTextContent(
      '2 work orders'
    )
    expect(screen.queryByText(NO_WORK_ORDERS)).not.toBeInTheDocument()
  })
})
