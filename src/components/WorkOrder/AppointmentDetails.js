import { useContext } from 'react'
import PropTypes from 'prop-types'
import UserContext from '../UserContext/UserContext'
import Link from 'next/link'
import { dateToStr } from '../../utils/date'
import {
  CLOSED_STATUS_DESCRIPTIONS,
  STATUS_CANCELLED,
} from '../../utils/status-codes'
import { priorityCodesRequiringAppointments } from '../../utils/helpers/priorities'
import {
  canSeeAppointmentDetailsInfo,
  canScheduleAppointment,
} from '../../utils/user-permissions'

const AppointmentDetails = ({ workOrder, schedulerSessionId }) => {
  const { user } = useContext(UserContext)

  const statusAllowsScheduling = (currentStatus) => {
    return !CLOSED_STATUS_DESCRIPTIONS.includes(currentStatus)
  }

  const appointmentNotApplicableHtml = () => {
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

  const appointmentDetailsInfoHtml = () => {
    return (
      <div className="lbh-body-s">
        <span className="govuk-!-font-size-14">
          {dateToStr(new Date(workOrder.appointment.date))},{' '}
          {workOrder.appointment.start}-{workOrder.appointment.end}
        </span>
      </div>
    )
  }

  const scheduleAppointmentHtml = () => {
    if (workOrder.externalAppointmentManagementUrl) {
      if (schedulerSessionId) {
        return (
          <Link
            href={`${workOrder.externalAppointmentManagementUrl}&sessionId=${schedulerSessionId}`}
          >
            <a className="lbh-link" target="_blank" rel="noopener">
              <strong>Open DRS</strong> to book an appointment
            </a>
          </Link>
        )
      } else {
        console.error('Scheduler Session ID does not exist')
      }
    } else {
      return (
        <Link href={`/work-orders/${workOrder.reference}/appointment/new`}>
          <a className="lbh-link lbh-!-font-weight-bold">
            Schedule an appointment
          </a>
        </Link>
      )
    }
  }

  if (priorityCodesRequiringAppointments.includes(workOrder.priorityCode)) {
    return (
      <div className="appointment-details">
        <span className="govuk-!-font-size-14">Appointment details</span>
        <br></br>
        <div className="lbh-body-s">
          {user &&
            canScheduleAppointment(user) &&
            statusAllowsScheduling(workOrder.status) &&
            !workOrder.appointment &&
            scheduleAppointmentHtml()}
          {user &&
            canSeeAppointmentDetailsInfo(user) &&
            workOrder.status !== STATUS_CANCELLED &&
            !!workOrder.appointment &&
            appointmentDetailsInfoHtml()}
        </div>
      </div>
    )
  } else {
    return appointmentNotApplicableHtml()
  }
}

AppointmentDetails.propTypes = {
  workOrder: PropTypes.object.isRequired,
}

export default AppointmentDetails
