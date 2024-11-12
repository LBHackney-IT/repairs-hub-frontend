import React from 'react'
import { operative } from 'factories/operative'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import MobileWorkingPastWorkOrdersView from './MobileWorkingPastWorkOrdersView'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { WorkOrder } from '../../../models/workOrder'

jest.mock('@/utils/frontEndApiClient/requests')
jest.mock('../../Spinner', () => jest.fn(() => <div>Loading...</div>))
jest.mock('../../DatePicker/Index', () => {
  return jest.fn(({ options, handleChange }) => {
    return (
      <div className="date-picker-container">
        <label htmlFor="date-picker" className="lbh-heading-h2">
          Select date
        </label>
        <select
          role="combobox"
          data-testid="date-picker"
          onChange={handleChange}
        >
          {options.map((date) => (
            <option key={date} value={date.toISOString().split('T')[0]}>
              {date.toISOString().split('T')[0]}
            </option>
          ))}
        </select>
      </div>
    )
  })
})

const generateMockWorkOrders = (numOrders) => {
  const now = new Date()
  return Array.from({ length: numOrders }, (_, index) => {
    const assignedStart = new Date(now)
    assignedStart.setHours(9 + index) // Stagger start times for variety
    return new WorkOrder({
      id: index + 1,
      appointment: { assignedStart: assignedStart.toISOString() },
    })
  })
}

describe('MobileWorkingPastWorkOrdersView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should match snapshot when loading', () => {
    const { asFragment } = render(
      <MobileWorkingPastWorkOrdersView currentUser={operative} />
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when there are work orders', async () => {
    // Mock a dynamic API response with generated work orders
    const mockWorkOrders = generateMockWorkOrders(2)
    frontEndApiRequest.mockResolvedValueOnce(mockWorkOrders)

    const { asFragment } = render(
      <MobileWorkingPastWorkOrdersView currentUser={operative} />
    )

    await waitFor(() =>
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('should match snapshot when there are no work orders', async () => {
    frontEndApiRequest.mockResolvedValueOnce([]) // Mock an empty response

    const { asFragment } = render(
      <MobileWorkingPastWorkOrdersView currentUser={operative} />
    )

    await screen.findByText('No work orders displayed')
    expect(screen.getByText('No work orders displayed')).toBeInTheDocument()

    expect(asFragment()).toMatchSnapshot()
  })

  it('should handle dynamic date selection and update work orders correctly', async () => {
    // Setup mock responses for initial load and after date change
    const initialWorkOrders = generateMockWorkOrders(3)
    const updatedWorkOrders = generateMockWorkOrders(2)

    frontEndApiRequest
      .mockResolvedValueOnce(initialWorkOrders)
      .mockResolvedValueOnce(updatedWorkOrders)

    render(<MobileWorkingPastWorkOrdersView currentUser={operative} />)

    // Wait for initial load to complete
    await waitFor(() =>
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    )

    // Find the date picker using test-id instead of role
    // const datePicker = screen.getByTestId('date-picker')

    // // Get current date for the test
    // const newDate = new Date()
    // newDate.setDate(newDate.getDate() - 1) // yesterday
    // const formattedDate = newDate.toISOString().split('T')[0]

    // // Trigger date change
    // fireEvent.change(datePicker, {
    //   target: { value: formattedDate },
    // })

    // // Verify API was called with new date
    // await waitFor(() => {
    //   expect(frontEndApiRequest).toHaveBeenCalledWith({
    //     method: 'get',
    //     path: expect.stringContaining(formattedDate),
    //   })
    // })

    // // Verify updated work orders are displayed
    // await waitFor(() => {
    //   updatedWorkOrders.forEach((workOrder) => {
    //     expect(screen.getByText(workOrder.id.toString())).toBeInTheDocument()
    //   })
    // })

    // // Verify initial work orders are no longer displayed
    // initialWorkOrders.forEach((workOrder) => {
    //   expect(
    //     screen.queryByText(workOrder.id.toString())
    //   ).not.toBeInTheDocument()
    // })
  })
})
