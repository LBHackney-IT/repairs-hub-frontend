import { dateToStr } from '@/utils/date'
import { Appointment } from '../../types/variations/types'

interface Props {
  appointment: Appointment
}

const AppointmentDetailsInfo = (props: Props) => {
  const { appointment } = props

  return (
    <p className="govuk-!-font-size-14">
      {dateToStr(new Date(appointment?.date))}, {appointment?.start}-
      {appointment?.end}
    </p>
  )
}

export default AppointmentDetailsInfo
