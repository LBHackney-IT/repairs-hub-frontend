import { useContext } from 'react'
import PropTypes from 'prop-types'
import UserContext from '../UserContext'
import { STATUS_CANCELLED } from '@/utils/statusCodes'
import {
  canSeeAppointmentDetailsInfo,
  canScheduleAppointment,
} from '@/utils/userPermissions'
import { WorkOrder } from '@/models/workOrder'
import { formatDateTime } from '../../utils/time'
import AppointmentDetailsInfo from './AppointmentDetailsInfo'
import ScheduleDRSAppointment from './ScheduleDRSAppointment'
import ScheduleInternalAppointmentLink from './ScheduleInternalAppointmentLink'

const AppointmentDetails = ({ workOrder }) => {
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
                  workOrder.status !== STATUS_CANCELLED && (
                    <AppointmentDetailsInfo workOrder={workOrder} />
                  )}

                {canScheduleAppointment(user) && workOrder.canBeScheduled() && (
                  <>
                    {workOrder?.externalAppointmentManagementUrl ? (
                      <ScheduleDRSAppointment
                        hasExistingAppointment={workOrder.appointment}
                        workOrder={workOrder}
                        workOrderReference={workOrder.reference}
                      />
                    ) : (
                      <ScheduleInternalAppointmentLink
                        hasExistingAppointment={workOrder.appointment}
                        workOrderReference={workOrder.reference}
                        appointmentIsToday={workOrder.appointmentIsToday()}
                      />
                    )}
                  </>
                )}

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
