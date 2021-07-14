import { useContext } from 'react'
import PropTypes from 'prop-types'
import UserContext from '../UserContext/UserContext'
import Link from 'next/link'
import { dateToStr } from '../../utils/date'
import { STATUS_CANCELLED } from '../../utils/status-codes'
import {
  canSeeAppointmentDetailsInfo,
  canScheduleAppointment,
} from '../../utils/user-permissions'
import { WorkOrder } from '../../models/work-order'
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

  const appointmentDetailsInfoHtml = () => {
    return (
      <span className="govuk-!-font-size-14">
        {dateToStr(new Date(workOrder.appointment.date))},{' '}
        {workOrder.appointment.start}-{workOrder.appointment.end}
      </span>
    )
  }

  const scheduleAppointmentHtml = (hasExistingAppointment) => {
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

  return (
    (canScheduleAppointment(user) || canSeeAppointmentDetailsInfo(user)) && (
      <div className="appointment-details">
        <span className="govuk-!-font-size-14">Appointment details</span>
        <br></br>
        <div className="lbh-body-s">
          {user && (
            <>
              {canScheduleAppointment(user) &&
                workOrder.statusAllowsScheduling() &&
                workOrder.isLowerPriority() &&
                scheduleAppointmentHtml(!!workOrder.appointment)}
              {canSeeAppointmentDetailsInfo(user) &&
                workOrder.status !== STATUS_CANCELLED &&
                !!workOrder.appointment &&
                appointmentDetailsInfoHtml()}
              {canSeeAppointmentDetailsInfo(user) &&
                !workOrder.appointment &&
                !workOrder.isLowerPriority() && (
                  <span className="lbh-!-font-weight-bold">Not applicable</span>
                )}
            </>
          )}
        </div>
      </div>
    )
  )
}

AppointmentDetails.propTypes = {
  workOrder: PropTypes.instanceOf(WorkOrder).isRequired,
}

export default AppointmentDetails
