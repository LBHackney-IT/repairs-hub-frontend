import React from 'react'
import { render, screen } from '@testing-library/react'
import PastWorkOrdersDatePicker from './Index'
import { beginningOfDay, getWorkingDaysBeforeDate } from '@/utils/time'
import TimezoneMock from 'timezone-mock'

const mockHandleDateChange = jest.fn()

describe('PastWorkOrdersDatePicker Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    TimezoneMock.register('Europe/London')
  })

  it('should be populated with the previous 5 working days', () => {
    const currentDate = beginningOfDay(new Date('2024-08-10'))
    const lastFiveWorkingDays = getWorkingDaysBeforeDate(currentDate, 7)

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
    const currentDate = beginningOfDay(new Date('2024-04-11'))
    const lastFiveWorkingDays = getWorkingDaysBeforeDate(currentDate, 7)

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
    const lastFiveWorkingDays = getWorkingDaysBeforeDate(currentDate, 7)

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

  afterEach(() => {
    TimezoneMock.unregister()
  })
})
