import { longMonthWeekday } from '@/utils/date'
import { Appointment } from '@/models/Appointment'

interface Props {
  appointment: Appointment
}

const AppointmentHeader = ({ appointment }: Props) => {
  return (
    <div className="mobile-working-title-banner">
      {appointment ? (
        <h2 className="lbh-heading-h2">
          {longMonthWeekday(appointment?.date, {
            commaSeparated: false,
          })}
          <br />
          {`${appointment?.start} – ${appointment?.end}`}
        </h2>
      ) : (
        <h2 className="lbh-heading-h2">No appointment</h2>
      )}
    </div>
  )
}

export default AppointmentHeader
