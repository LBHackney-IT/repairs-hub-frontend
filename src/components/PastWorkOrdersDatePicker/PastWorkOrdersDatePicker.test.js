import React from 'react'
import { render, screen } from '@testing-library/react'
import PastWorkOrdersDatePicker from './Index'
import { beginningOfDay, daysBeforeDateRangeExcWeekend } from '@/utils/time'

const mockHandleDateChange = jest.fn()

describe('PastWorkOrdersDatePicker Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be populated with the previous 5 working days', () => {
    const currentDate = beginningOfDay(new Date('2024-08-10'))
    const lastFiveWorkingDays = daysBeforeDateRangeExcWeekend(currentDate, 7)

    const { asFragment } = render(
      <PastWorkOrdersDatePicker
        currentDate={currentDate}
        handleChange={mockHandleDateChange}
      />
    )

    const options = screen.getAllByTestId('date-option')
    options.forEach((option, index) => {
      const expectedDate = lastFiveWorkingDays[index]

      // Check the text content matches the expected day display
      const formattedDate = expectedDate.toString().slice(3, 10)
      expect(option.textContent).toContain(formattedDate)
    })
    expect(asFragment()).toMatchSnapshot()
  })
  it('should be populated with the previous 5 working days', () => {
    const currentDate = beginningOfDay(new Date('2024-04-05'))
    const lastFiveWorkingDays = daysBeforeDateRangeExcWeekend(currentDate, 7)

    const { asFragment } = render(
      <PastWorkOrdersDatePicker
        currentDate={currentDate}
        handleChange={mockHandleDateChange}
      />
    )

    const options = screen.getAllByTestId('date-option')
    options.forEach((option, index) => {
      const expectedDate = lastFiveWorkingDays[index]

      // Check the text content matches the expected day display
      const formattedDate = expectedDate.toString().slice(3, 10)
      expect(option.textContent).toContain(formattedDate)
    })
    expect(asFragment()).toMatchSnapshot()
  })
  it('should be populated with the previous 5 working days spanning a different year', () => {
    const currentDate = beginningOfDay(new Date('2024-01-01'))
    const lastFiveWorkingDays = daysBeforeDateRangeExcWeekend(currentDate, 7)

    const { asFragment } = render(
      <PastWorkOrdersDatePicker
        currentDate={currentDate}
        handleChange={mockHandleDateChange}
      />
    )

    const options = screen.getAllByTestId('date-option')
    options.forEach((option, index) => {
      const expectedDate = lastFiveWorkingDays[index]

      // Check the text content matches the expected day display
      const formattedDate = expectedDate.toString().slice(3, 10)
      expect(option.textContent).toContain(formattedDate)
    })
    expect(asFragment()).toMatchSnapshot()
  })
})
