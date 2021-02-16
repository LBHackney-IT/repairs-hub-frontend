import { render } from '@testing-library/react'
import AppointmentCalendar from './AppointmentCalendar'

describe('AppointmentCalendar component', () => {
  const props = {
    availableAppointments: [],
    currentDate: new Date('2021-02-16T00:00:00Z'),
    startOfCalendar: new Date('2021-02-15T00:00:00Z'),
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <AppointmentCalendar
        availableAppointments={props.availableAppointments}
        currentDate={props.currentDate}
        startOfCalendar={props.startOfCalendar}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
