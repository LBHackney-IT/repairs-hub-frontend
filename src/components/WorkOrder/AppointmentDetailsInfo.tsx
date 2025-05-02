import { dateToStr } from '@/utils/date'
import { WorkOrderAppointmentDetails } from './WorkOrderHeader'

interface Props {
  appointmentDetails: WorkOrderAppointmentDetails
}

const AppointmentDetailsInfo = (props: Props) => {
  const { appointmentDetails } = props

  return (
    <p className="govuk-!-font-size-14">
      {dateToStr(new Date(appointmentDetails.appointment.date))},{' '}
      {appointmentDetails.appointment.start}-
      {appointmentDetails.appointment.end}
    </p>
  )
}

export default AppointmentDetailsInfo
