import { render } from '@testing-library/react'
import ScheduleAppointmentSuccess from './ScheduleAppointmentSuccess'

describe('ScheduleAppointmentSuccess component', () => {
  const props = {
    workOrderReference: '12345678',
    property: {
      propertyReference: '00023400',
      address: {
        addressLine: '12 Pitcairn House',
      },
    },
    comments: 'some comments',
    slot: 'PM 12:00-4:00',
    dateSelected: 'Thursday, 25 February',
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <ScheduleAppointmentSuccess
        workOrderReference={props.workOrderReference}
        property={props.property}
        comments={props.comments}
        slot={props.slot}
        dateSelected={props.dateSelected}
        title={'Repair work order created'}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
