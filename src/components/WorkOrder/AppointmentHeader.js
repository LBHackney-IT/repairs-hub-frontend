import PropTypes from 'prop-types'
import { longMonthWeekday } from '@/utils/date'

const AppointmentHeader = ({ workOrder }) => {
  return (
    <div className="mobile-working-title-banner">
      {workOrder.appointment ? (
        <h2 className="lbh-heading-h2">
          {longMonthWeekday(workOrder.appointment.date, {
            commaSeparated: false,
          })}
          <br />
          {`${workOrder.appointment.start} – ${workOrder.appointment.end}`}
        </h2>
      ) : (
        <h2 className="lbh-heading-h2">No appointment</h2>
      )}
    </div>
  )
}

AppointmentHeader.propTypes = {
  workOrder: PropTypes.object.isRequired,
}

export default AppointmentHeader
