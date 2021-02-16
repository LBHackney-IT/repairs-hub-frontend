import PropTypes from 'prop-types'
import Link from 'next/link'

const AppointmentDetails = ({ workOrder }) => {
  if (workOrder.priorityCode > 1) {
    return (
      <div className="appointment-details">
        <span className="govuk-!-font-size-14">Appointment details</span>
        <br></br>
        <div className="govuk-body-s">
          <Link href={`/work-orders/${workOrder.reference}/appointment/new`}>
            <a className="govuk-!-font-weight-bold">Schedule an appointment</a>
          </Link>
        </div>
      </div>
    )
  } else {
    return (
      <div className="appointment-details">
        <span className="govuk-!-font-size-14">Appointment details</span>
        <br></br>
        <div className="govuk-body-s">
          <span className="govuk-!-font-weight-bold">Not applicable</span>
        </div>
      </div>
    )
  }
}

AppointmentDetails.propTypes = {
  workOrder: PropTypes.object.isRequired,
}

export default AppointmentDetails
