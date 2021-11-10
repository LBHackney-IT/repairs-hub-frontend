import PropTypes from 'prop-types'
import { longMonthWeekday } from '@/utils/date'

const AppointmentHeader = ({ workOrder }) => {
  return (
    <div className="govuk-panel govuk-panel--confirmation lbh-panel appointment-header">
      {workOrder.appointment ? (
        <h3 className="lbh-heading-h3">
          {longMonthWeekday(workOrder.appointment.date)}
          <br />
          {workOrder.appointment.start}-{workOrder.appointment.end}
        </h3>
      ) : (
        <h3 className="lbh-heading-h3">No appointment</h3>
      )}
    </div>
  )
}

AppointmentHeader.propTypes = {
  workOrder: PropTypes.object.isRequired,
}

export default AppointmentHeader
