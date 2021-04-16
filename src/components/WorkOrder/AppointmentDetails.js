import { useContext } from 'react'
import PropTypes from 'prop-types'
import UserContext from '../UserContext/UserContext'
import Link from 'next/link'
import { dateToStr } from '../../utils/date'

const AppointmentDetails = ({ workOrder }) => {
  const { user } = useContext(UserContext)
  const STATUS_CANCELLED = 'Work Cancelled'
  if (workOrder.priorityCode > 1) {
    return (
      <div className="appointment-details">
        <span className="govuk-!-font-size-14">Appointment details</span>
        <br></br>
        <div className="govuk-body-s">
          {user &&
            user.hasAgentPermissions &&
            workOrder.status !== STATUS_CANCELLED &&
            !workOrder.appointment && (
              <Link
                href={`/work-orders/${workOrder.reference}/appointment/new`}
              >
                <a className="govuk-!-font-weight-bold">
                  Schedule an appointment
                </a>
              </Link>
            )}
          {user &&
            (user.hasAgentPermissions || user.hasContractorPermissions) &&
            workOrder.status !== STATUS_CANCELLED &&
            !!workOrder.appointment && (
              <div className="govuk-body-s">
                <span className="govuk-!-font-size-14">
                  {dateToStr(new Date(workOrder.appointment.date))},{' '}
                  {workOrder.appointment.start}-{workOrder.appointment.end}
                </span>
              </div>
            )}
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
