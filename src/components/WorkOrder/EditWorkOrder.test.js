import { render, waitFor } from '@testing-library/react'
import EditWorkOrder from './EditWorkOrder'
import { getWorkOrder } from '@/utils/requests/workOrders'

jest.mock('@/utils/requests/workOrders', () => ({
  getWorkOrder: jest.fn(),
}))

const mockWorkOrder = {
  reference: 10000040,
  description: 'Fix the leaking pipe',
}

describe('EditWorkOrder Component', () => {
  beforeEach(() => {
    getWorkOrder.mockResolvedValue({
      response: mockWorkOrder,
      success: true,
      error: null,
    })
  })

  it('should render correctly after fetching work order', async () => {
    const { asFragment, getByText } = render(
      <EditWorkOrder workOrderReference={mockWorkOrder.reference} />
    )

    // Wait for the async fetch to complete and the form to render
    await waitFor(() =>
      expect(getByText('Edit work order: 10000040')).toBeInTheDocument()
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
