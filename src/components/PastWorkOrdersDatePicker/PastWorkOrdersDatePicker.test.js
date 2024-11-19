import React from 'react'
import { render, screen } from '@testing-library/react'
import PastWorkOrdersDatePicker from './Index'
import { beginningOfDay, getWorkingDaysBeforeDate } from '@/utils/time'
import TimezoneMock from 'timezone-mock'
import { format } from 'date-fns'

const mockHandleDateChange = jest.fn()

export const getWorkingDaysBeforeDateForTests = (date, totalDaysToProcess) => {
  const DAY = 24 * 60 * 60 * 1000 // One day in milliseconds

  // Generate an array of the past `totalDaysToProcess` days in UTC
  const daysCountdown = Array.from({ length: totalDaysToProcess }, (_, i) => {
    const offset = i * DAY
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
        offset
    )
  })

  // Filter out weekends (Saturday and Sunday)
  const removeWeekends = daysCountdown.filter((date) => {
    const dayOfWeek = date.getUTCDay()
    return dayOfWeek !== 0 && dayOfWeek !== 6 // Keep only weekdays
  })

  // Return only the first 5 working days
  return removeWeekends // Ensure chronological order
}

describe('PastWorkOrdersDatePicker Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    TimezoneMock.register('Europe/London')
  })

  it('should be populated with the previous 5 working days', () => {
    const currentDate = beginningOfDay(new Date('2024-08-10'))
    const lastFiveWorkingDays = getWorkingDaysBeforeDateForTests(currentDate, 7)

    const { asFragment } = render(
      <PastWorkOrdersDatePicker
        currentDate={currentDate}
        handleChange={mockHandleDateChange}
        lastFiveWorkingDays={lastFiveWorkingDays}
      />
    )

    const options = screen.getAllByTestId('date-option')

    options.forEach((option, index) => {
      const expectedDate = lastFiveWorkingDays[index]
      // Check the text content matches the expected day display
      const formattedDate = format(expectedDate, 'MMM dd')

      expect(option.textContent).toContain(formattedDate)
    })

    expect(asFragment()).toMatchSnapshot()
  })
  it('should be populated with the previous 5 working days', () => {
    const currentDate = beginningOfDay(new Date('2024-04-11'))
    const lastFiveWorkingDays = getWorkingDaysBeforeDateForTests(currentDate, 7)

    const { asFragment } = render(
      <PastWorkOrdersDatePicker
        currentDate={currentDate}
        handleChange={mockHandleDateChange}
        lastFiveWorkingDays={lastFiveWorkingDays}
      />
    )

    const options = screen.getAllByTestId('date-option')
    options.forEach((option, index) => {
      const expectedDate = lastFiveWorkingDays[index]

      // Check the text content matches the expected day display
      const formattedDate = format(expectedDate, 'MMM dd')
      expect(option.textContent).toContain(formattedDate)
    })
    expect(asFragment()).toMatchSnapshot()
  })
  it('should be populated with the previous 5 working days spanning a different year', () => {
    const currentDate = beginningOfDay(new Date('2024-01-01'))
    const lastFiveWorkingDays = getWorkingDaysBeforeDateForTests(currentDate, 7)

    const { asFragment } = render(
      <PastWorkOrdersDatePicker
        currentDate={currentDate}
        handleChange={mockHandleDateChange}
        lastFiveWorkingDays={lastFiveWorkingDays}
      />
    )

    const options = screen.getAllByTestId('date-option')
    options.forEach((option, index) => {
      const expectedDate = lastFiveWorkingDays[index]

      // Check the text content matches the expected day display
      const formattedDate = format(expectedDate.d, 'MMM dd')
      expect(option.textContent).toContain(formattedDate)
    })
    expect(asFragment()).toMatchSnapshot()
  })

  afterEach(() => {
    TimezoneMock.unregister()
  })
})
