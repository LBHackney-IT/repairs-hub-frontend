import { useContext } from 'react'
import UserContext from '../UserContext'
import { STATUS_CANCELLED } from '@/utils/statusCodes'
import {
  canSeeAppointmentDetailsInfo,
  canScheduleAppointment,
} from '@/root/src/utils/auth/userPermissions'
import { WorkOrder } from '@/models/workOrder'
import { formatDateTime } from '../../utils/time'
import AppointmentDetailsInfo from './AppointmentDetailsInfo'
import ScheduleAppointment from './ScheduleAppointment/ScheduleAppointment'
import ScheduleInternalAppointmentLink from './ScheduleInternalAppointmentLink'

interface Props {
  workOrder: WorkOrder
}

const AppointmentDetails = ({ workOrder }: Props) => {
  const { user } = useContext(UserContext)

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
