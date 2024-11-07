import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import MobileWorkingPastWorkOrdersView from './MobileWorkingPastWorkOrdersView'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { WorkOrder } from '../../../models/workOrder'

// Mock dependencies
jest.mock('@/utils/frontEndApiClient/requests')
jest.mock('../../Spinner', () => jest.fn(() => <div>Loading...</div>))

const mockCurrentUser = {
  sub: '112088470639703810484',
  name: 'Alexander Perez-Davies',
  email: 'alexander.perez-davies@hackney.gov.uk',
  varyLimit: '10000',
  raiseLimit: '10000',
  contractors: [],
  operativePayrollNumber: null,
  isOneJobAtATime: false,
}

describe('MobileWorkingPastWorkOrdersView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should match snapshot when loading', async () => {
    // Mock the API response for a successful fetch
    frontEndApiRequest.mockResolvedValueOnce([
      new WorkOrder({
        id: 1,
        appointment: { assignedStart: '2024-11-07T09:00' },
      }),
      new WorkOrder({
        id: 2,
        appointment: { assignedStart: '2024-11-07T10:00' },
      }),
    ])

    const { asFragment } = render(
      <MobileWorkingPastWorkOrdersView currentUser={mockCurrentUser} />
    )

    // Assert that the component matches the snapshot
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when there is no work orders', async () => {
    // Mock the API response for an empty list
    frontEndApiRequest.mockResolvedValueOnce([])

    const { asFragment } = render(
      <MobileWorkingPastWorkOrdersView currentUser={mockCurrentUser} />
    )

    // Wait for the component to re-render after API request
    await screen.findByText('No work orders displayed')

    // Assert that the component matches the snapshot
    expect(asFragment()).toMatchSnapshot()
  })

  it('should show loading spinner initially', () => {
    // Render the component with no data yet (loading state)
    const { asFragment } = render(
      <MobileWorkingPastWorkOrdersView currentUser={mockCurrentUser} />
    )

    // Assert that the component shows the loading spinner initially
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    // Match snapshot for loading state
    expect(asFragment()).toMatchSnapshot()
  })

  it('should update the selected date correctly', async () => {
    const { asFragment } = render(
      <MobileWorkingPastWorkOrdersView currentUser={mockCurrentUser} />
    )

    // Select a new date
    const datePicker = screen.getByLabelText('Select date')
    const options = datePicker.querySelectorAll('option')
    options[1].selected = true // Select the second option

    // Fire change event
    fireEvent.change(datePicker, { target: { value: options[1].value } })

    // Match snapshot after date change
    expect(asFragment()).toMatchSnapshot()
  })
})
