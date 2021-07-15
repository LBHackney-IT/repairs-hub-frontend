import { useContext } from 'react'
import PropTypes from 'prop-types'
import UserContext from '../UserContext/UserContext'
import Link from 'next/link'
import { convertDate, dateToStr } from '../../utils/date'
import {
  STATUS_CANCELLED,
  STATUS_AUTHORISATION_PENDING_APPROVAL,
} from '../../utils/status-codes'
import { priorityCodesRequiringAppointments } from '../../utils/helpers/priorities'
import {
  canSeeAppointmentDetailsInfo,
  canScheduleAppointment,
} from '../../utils/user-permissions'
import { buildDataFromScheduleAppointment } from '../../utils/hact/job-status-update/notes-form'
import { postJobStatusUpdate } from '../../utils/frontend-api-client/job-status-update'

const AppointmentDetails = ({ workOrder, schedulerSessionId }) => {
  const { user } = useContext(UserContext)

  const openExternalLinkEventHandler = async () => {
    const jobStatusUpdate = buildDataFromScheduleAppointment(
      workOrder.reference.toString(),
      `${user.name} opened the DRS Web Booking Manager`
    )

    await postJobStatusUpdate(jobStatusUpdate)
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

  const scheduleAppointmentHtml = (hasExistingAppointment) => {
    const targetTime = convertDate(workOrder.target)
    const now = Date.now()

    if (targetTime && targetTime < now) {
      return null
    }

    if (workOrder.externalAppointmentManagementUrl) {
      if (schedulerSessionId) {
        return (
          <Link
            href={`${workOrder.externalAppointmentManagementUrl}&sessionId=${schedulerSessionId}`}
          >
            <a
              className="lbh-link"
              target="_blank"
              rel="noopener"
              onClick={openExternalLinkEventHandler}
            >
              <strong>Open DRS</strong> to{' '}
              {hasExistingAppointment ? 'reschedule' : 'book an'} appointment
            </a>
          </Link>
        )
      } else {
        console.error('Scheduler Session ID does not exist')
      }
    } else {
      const href = hasExistingAppointment
        ? `/work-orders/${workOrder.reference}/appointment/edit`
        : `/work-orders/${workOrder.reference}/appointment/new`

      const linkText = hasExistingAppointment
        ? 'Reschedule appointment'
        : 'Schedule an appointment'

      return (
        <Link href={href}>
          <a className="lbh-link lbh-!-font-weight-bold">{linkText}</a>
        </Link>
      )
    }
  }

  if (priorityCodesRequiringAppointments.includes(workOrder.priorityCode)) {
    return (
      <div className="appointment-details">
        <span className="govuk-!-font-size-14">Appointment details</span>
        <br></br>
        <div className="lbh-body-s govuk-!-margin-top-0">
          {user &&
            canSeeAppointmentDetailsInfo(user) &&
            workOrder.status !== STATUS_CANCELLED &&
            !!workOrder.appointment &&
            appointmentDetailsInfoHtml()}
          {user &&
            canScheduleAppointment(user) &&
            workOrder.status !== STATUS_CANCELLED.description &&
            workOrder.status !==
              STATUS_AUTHORISATION_PENDING_APPROVAL.description &&
            scheduleAppointmentHtml(!!workOrder.appointment)}
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
