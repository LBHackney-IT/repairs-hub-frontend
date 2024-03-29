import { useContext, useEffect, useRef } from 'react'
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
import { buildDataFromScheduleAppointment } from '../../utils/hact/jobStatusUpdate/notesForm'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'

const AppointmentDetails = ({
  workOrder,
  schedulerSessionId,

  resetSchedulerSessionId,
}) => {
  const { user } = useContext(UserContext)

  const userOpenedWBM = useRef(false)
  const focusRef = useRef(null)

  const onWindowFocusCallback = () => {
    if (!userOpenedWBM.current) return

    // refresh page to trigger manual sync
    window.location.reload()
  }

  useEffect(() => {
    const ref = window.addEventListener('focus', onWindowFocusCallback, false)

    focusRef.current = ref

    return () => {
      window.removeEventListener(focusRef.current, onWindowFocusCallback, false)
    }
  }, [])

  const openExternalLinkEventHandler = async () => {
    userOpenedWBM.current = true

    const jobStatusUpdate = buildDataFromScheduleAppointment(
      workOrder.reference.toString(),
      `${user.name} opened the DRS Web Booking Manager`
    )

    await frontEndApiRequest({
      method: 'post',
      path: `/api/jobStatusUpdate`,
      requestData: jobStatusUpdate,
    })

    setTimeout(() => {
      // sessionId is single use, so reset it
      resetSchedulerSessionId()
    }, 500)
  }

  const appointmentDetailsInfoHtml = () => {
    return (
      <p className="govuk-!-font-size-14">
        {dateToStr(new Date(workOrder.appointment.date))},{' '}
        {workOrder.appointment.start}-{workOrder.appointment.end}
      </p>
    )
  }

  const scheduleAppointmentHtml = (hasExistingAppointment) => {
    if (workOrder.externalAppointmentManagementUrl) {
      if (schedulerSessionId) {
        return (
          <ScheduleDRSAppointmentLink
            workOrder={workOrder}
            schedulerSessionId={schedulerSessionId}
            openLinkEventHandler={openExternalLinkEventHandler}
            hasExistingAppointment={hasExistingAppointment}
            appointmentIsToday={workOrder.appointmentIsToday()}
          />
        )
      } else {
        console.error('Scheduler Session ID does not exist')
      }
    } else {
      return (
        <ScheduleInternalAppointmentLink
          workOrderReference={workOrder.reference}
          hasExistingAppointment={hasExistingAppointment}
          appointmentIsToday={workOrder.appointmentIsToday()}
        />
      )
    }
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
