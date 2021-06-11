import { useContext } from 'react'
import PropTypes from 'prop-types'
import UserContext from '../UserContext/UserContext'
import Link from 'next/link'
import { dateToStr } from '../../utils/date'
import {
  STATUS_CANCELLED,
  STATUS_AUTHORISATION_PENDING_APPROVAL,
} from '../../utils/status-codes'
import { IMMEDIATE_PRIORITY_CODE } from '../../utils/helpers/priorities'

const AppointmentDetails = ({ workOrder }) => {
  const { user } = useContext(UserContext)

  if (workOrder.priorityCode !== IMMEDIATE_PRIORITY_CODE) {
    return (
      <div className="appointment-details">
        <span className="govuk-!-font-size-14">Appointment details</span>
        <br></br>
        <div className="lbh-body-s">
          {user &&
            (user.hasAgentPermissions ||
              user.hasContractManagerPermissions ||
              user.hasAuthorisationManagerPermissions) &&
            workOrder.status !== STATUS_CANCELLED.description &&
            workOrder.status !==
              STATUS_AUTHORISATION_PENDING_APPROVAL.description &&
            !workOrder.appointment && (
              <Link
                href={`/work-orders/${workOrder.reference}/appointment/new`}
              >
                <a className="lbh-link lbh-!-font-weight-bold">
                  Schedule an appointment
                </a>
              </Link>
            )}
          {user &&
            (user.hasAgentPermissions ||
              user.hasContractorPermissions ||
              user.hasContractManagerPermissions) &&
            workOrder.status !== STATUS_CANCELLED &&
            !!workOrder.appointment && (
              <div className="lbh-body-s">
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
        <div className="lbh-body-s">
          <span className="lbh-!-font-weight-bold">Not applicable</span>
        </div>
      </div>
    )
  }
}

AppointmentDetails.propTypes = {
  workOrder: PropTypes.object.isRequired,
}

export default AppointmentDetails
