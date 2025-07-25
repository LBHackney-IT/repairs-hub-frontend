import { useContext } from 'react'
import UserContext from '../UserContext'
import {
  STATUS_AUTHORISATION_PENDING_APPROVAL,
  STATUS_CANCELLED,
  STATUS_COMPLETED,
  STATUS_NO_ACCESS,
} from '@/utils/statusCodes'
import {
  canSeeAppointmentDetailsInfo,
  canScheduleAppointment,
} from '@/utils/userPermissions'
import { WorkOrder } from '@/models/workOrder'
import { formatDateTime } from '../../utils/time'
import AppointmentDetailsInfo from './AppointmentDetailsInfo'
import ScheduleAppointment from './ScheduleAppointment/ScheduleAppointment'
import ScheduleInternalAppointmentLink from './ScheduleInternalAppointmentLink'
import { DrsBookingLifeCycleStatusBadge } from '../DrsBookingLifeCycleStatusBadge'

interface Props {
  workOrder: WorkOrder
}

const INACTIVE_STATUS_CODES = new Set<string>([
  STATUS_CANCELLED.description,
  STATUS_AUTHORISATION_PENDING_APPROVAL.description,
  STATUS_COMPLETED.description,
  STATUS_NO_ACCESS.description,
])

const AppointmentDetails = ({ workOrder }: Props) => {
  const { user } = useContext(UserContext)

  const showDrsLifeCycleStatus = () => {
    if (!canSeeAppointmentDetailsInfo(user)) return false
    if (!workOrder?.appointment?.bookingLifeCycleStatus) return false

    // hide when workorder is inactive
    if (INACTIVE_STATUS_CODES.has(workOrder.status)) return false

    return true
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
          <p className="govuk-!-font-size-16 govuk-!-margin-bottom-1">
            Appointment details
          </p>

          {showDrsLifeCycleStatus() && (
            <DrsBookingLifeCycleStatusBadge
              bookingLifeCycleStatus={
                workOrder?.appointment?.bookingLifeCycleStatus
              }
            />
          )}

          <div className="lbh-body-s govuk-!-margin-0">
            {user && (
              <>
                {canSeeAppointmentDetailsInfo(user) &&
                  workOrder.appointment &&
                  workOrder.status !== STATUS_CANCELLED.description && (
                    <AppointmentDetailsInfo
                      appointment={workOrder?.appointment}
                    />
                  )}

                {canScheduleAppointment(user) &&
                  workOrder.canBeScheduled() &&
                  (workOrder?.externalAppointmentManagementUrl ? (
                    <ScheduleAppointment
                      externalAppointmentManagementUrl={
                        workOrder.externalAppointmentManagementUrl
                      }
                      hasExistingAppointment={!!workOrder?.appointment}
                      workOrder={workOrder}
                      workOrderReference={workOrder.reference}
                    />
                  ) : (
                    <ScheduleInternalAppointmentLink
                      workOrderReference={workOrder.reference}
                      hasExistingAppointment={!!workOrder?.appointment}
                      appointmentIsToday={workOrder.appointmentIsToday()}
                    />
                  ))}

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

export default AppointmentDetails
