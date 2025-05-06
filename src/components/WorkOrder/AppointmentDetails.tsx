import { useContext } from 'react'
import UserContext from '../UserContext'
import { STATUS_CANCELLED } from '@/utils/statusCodes'
import {
  canSeeAppointmentDetailsInfo,
  canScheduleAppointment,
} from '@/utils/userPermissions'
import { WorkOrder } from '@/models/workOrder'
import { formatDateTime } from '../../utils/time'
import AppointmentDetailsInfo from './AppointmentDetailsInfo'
import ScheduleAppointment from './ScheduleAppointment/ScheduleAppointment'
import ScheduleInternalAppointmentLink from './ScheduleInternalAppointmentLink'
import { WorkOrderAppointmentDetails } from './types'

interface Props {
  workOrder: WorkOrder
  appointmentDetails: WorkOrderAppointmentDetails
}

const AppointmentDetails = ({ workOrder, appointmentDetails }: Props) => {
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
        <div className="appointment-details" style={{ marginTop: 0 }}>
          {/* <p className="govuk-!-font-size-14">Appointment details</p> */}
          <div className="lbh-body-s govuk-!-margin-0">
            {user && (
              <>
                {canSeeAppointmentDetailsInfo(user) &&
                  appointmentDetails?.appointment &&
                  workOrder.status !== STATUS_CANCELLED && (
                    <AppointmentDetailsInfo
                      appointmentDetails={appointmentDetails}
                    />
                  )}

                {canScheduleAppointment(user) &&
                  workOrder.canBeScheduled() &&
                  (appointmentDetails?.externalAppointmentManagementUrl ? (
                    <ScheduleAppointment
                      hasExistingAppointment={!!appointmentDetails?.appointment}
                      workOrderReference={workOrder.reference}
                      appointmentIsToday={workOrder.appointmentIsToday()}
                      externalAppointmentManagementUrl={
                        appointmentDetails?.externalAppointmentManagementUrl
                      }
                    />
                  ) : (
                    <ScheduleInternalAppointmentLink
                      workOrderReference={workOrder.reference}
                      hasExistingAppointment={appointmentDetails?.appointment}
                      appointmentIsToday={workOrder.appointmentIsToday()}
                    />
                  ))}

                {canSeeAppointmentDetailsInfo(user) &&
                  !appointmentDetails?.appointment &&
                  !workOrder.canBeScheduled() && (
                    <p
                      className="lbh-!-font-weight-bold"
                      style={{ marginTop: 0 }}
                    >
                      Not applicable
                    </p>
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
