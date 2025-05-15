import { render } from '@testing-library/react'
import AppointmentHeader from './AppointmentHeader'

describe('AppointmentHeader component', () => {
  it('should render the date when the appointment has one', () => {
    const { asFragment } = render(
      <AppointmentHeader
        appointment={{
          date: '2021-03-19',
          description: 'PM Slot',
          end: '18:00',
          start: '12:00',
        }}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render info text when there is no appointment', () => {
    const { asFragment } = render(<AppointmentHeader workOrder={{}} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
