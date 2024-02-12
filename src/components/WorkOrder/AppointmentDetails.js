import { useContext } from 'react'
import PropTypes from 'prop-types'
import UserContext from '../UserContext'
import { dateToStr } from '@/utils/date'
import { STATUS_CANCELLED } from '@/utils/statusCodes'
import {
  canSeeAppointmentDetailsInfo,
  canScheduleAppointment,
} from '@/utils/userPermissions'
import { WorkOrder } from '@/models/workOrder'
import ScheduleDRSAppointmentLink from './ScheduleDRSAppointmentLink'
import ScheduleInternalAppointmentLink from './ScheduleInternalAppointmentLink'
import { formatDateTime } from '../../utils/time'

const AppointmentDetails = ({ workOrder }) => {
  const { user } = useContext(UserContext)

  const appointmentDetailsInfoHtml = () => {
    return (
      <p className="govuk-!-font-size-14">
        {dateToStr(new Date(workOrder.appointment.date))},{' '}
        {workOrder.appointment.start}-{workOrder.appointment.end}
      </p>
    )
  }

  const scheduleAppointmentHtml = (hasExistingAppointment) => {
    const isDrsAppointment = workOrder.externalAppointmentManagementUrl !== null

    if (!isDrsAppointment) {
      return (
        <ScheduleInternalAppointmentLink
          workOrderReference={workOrder.reference}
          hasExistingAppointment={hasExistingAppointment}
          appointmentIsToday={workOrder.appointmentIsToday()}
        />
      )
    }

    // if (schedulerSessionId) {
    return (
      <ScheduleDRSAppointmentLink
        workOrder={workOrder}
        // schedulerSessionId={schedulerSessionId}
        // openLinkEventHandler={openExternalLinkEventHandler}
        hasExistingAppointment={hasExistingAppointment}
        appointmentIsToday={workOrder.appointmentIsToday()}
      />
    )
    // } else {
    // console.error('Scheduler Session ID does not exist')
    // }
  }

  return (
    <>
      {!!workOrder?.startTime && (
        <div className="lbh-body-xs govuk-!-margin-bottom-2">
          <span>Started at</span>
          <br></br>
          <span>{formatDateTime(workOrder.startTime)}</span>
        </div>
      )}
      {(canScheduleAppointment(user) || canSeeAppointmentDetailsInfo(user)) && (
        <div className="appointment-details">
          <p className="govuk-!-font-size-14">Appointment details</p>
          <div className="lbh-body-s govuk-!-margin-0">
            {user && (
              <>
                {canSeeAppointmentDetailsInfo(user) &&
                  workOrder.appointment &&
                  workOrder.status !== STATUS_CANCELLED &&
                  appointmentDetailsInfoHtml()}

                {canScheduleAppointment(user) &&
                  workOrder.canBeScheduled() &&
                  scheduleAppointmentHtml(workOrder.appointment)}

                {canSeeAppointmentDetailsInfo(user) &&
                  !workOrder.appointment &&
                  !workOrder.canBeScheduled() && (
                    <p className="lbh-!-font-weight-bold">Not applicable</p>
                  )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

AppointmentDetails.propTypes = {
  workOrder: PropTypes.instanceOf(WorkOrder).isRequired,
}

export default AppointmentDetails
