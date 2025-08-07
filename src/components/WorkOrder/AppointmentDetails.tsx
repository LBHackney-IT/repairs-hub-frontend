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
import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'

interface Props {
  workOrder: WorkOrder
  appointmentDetails: WorkOrderAppointmentDetails
}

const INACTIVE_STATUS_CODES = new Set<string>([
  STATUS_CANCELLED.description,
  STATUS_AUTHORISATION_PENDING_APPROVAL.description,
  STATUS_COMPLETED.description,
  STATUS_NO_ACCESS.description,
])

const AppointmentDetails = (props: Props) => {
  const { workOrder, appointmentDetails } = props

  const { user } = useContext(UserContext)

  const showDrsLifeCycleStatus = () => {
    if (!canSeeAppointmentDetailsInfo(user)) return false
    if (!appointmentDetails?.appointment?.bookingLifeCycleStatus) return false

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
                appointmentDetails?.appointment?.bookingLifeCycleStatus
              }
            />
          )}

          <div className="lbh-body-s govuk-!-margin-0">
            {user && (
              <>
                {canSeeAppointmentDetailsInfo(user) &&
                  appointmentDetails.appointment &&
                  workOrder.status !== STATUS_CANCELLED.description && (
                    <AppointmentDetailsInfo
                      appointment={appointmentDetails?.appointment}
                    />
                  )}

                {canScheduleAppointment(user) &&
                  workOrder.canBeScheduled() &&
                  (appointmentDetails?.externalAppointmentManagementUrl ? (
                    <ScheduleAppointment
                      appointmentDetails={appointmentDetails}
                      hasExistingAppointment={!!appointmentDetails?.appointment}
                      workOrderReference={workOrder.reference}
                    />
                  ) : (
                    <ScheduleInternalAppointmentLink
                      workOrderReference={workOrder.reference}
                      hasExistingAppointment={!!appointmentDetails?.appointment}
                      appointmentIsToday={appointmentDetails.appointmentIsToday()}
                    />
                  ))}

                {canSeeAppointmentDetailsInfo(user) &&
                  !appointmentDetails.appointment &&
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
