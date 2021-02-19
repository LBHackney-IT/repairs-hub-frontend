import MockDate from 'mockdate'
import { render } from '@testing-library/react'
import AppointmentCalendar from './AppointmentCalendar'

describe('AppointmentCalendar component', () => {
  const props = {
    availableAppointments: [],
  }

  // start of week for this date is 2021-02-15T00:00:00Z
  const currentDate = new Date('2021-02-18T00:00:00Z')

  beforeAll(() => {
    MockDate.set(currentDate.getTime())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should render properly', () => {
    const { asFragment } = render(
      <AppointmentCalendar
        availableAppointments={props.availableAppointments}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
