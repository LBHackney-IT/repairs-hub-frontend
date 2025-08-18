import { WorkOrder } from '../../models/workOrder'
import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'
import { CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES } from '../../utils/statusCodes'
import { formatDateTime } from '../../utils/time'
import ErrorMessage from '../Errors/ErrorMessage'
import FurtherWorkRequiredFlag from '../Flags/FurtherWorkRequiredFlag'
import Spinner from '../Spinner'
import AppointmentDetails from './AppointmentDetails'
import Operatives from './Operatives'

interface Props {
  appointmentDetails: WorkOrderAppointmentDetails
  appointmentDetailsError: string | null
  loadingAppointmentDetails: boolean

  workOrder: WorkOrder
}

const WorkOrderAppointmentDetailsHeader = (props: Props) => {
  const {
    appointmentDetails,
    appointmentDetailsError,
    loadingAppointmentDetails,
    workOrder,
  } = props

  const readOnly = CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES.includes(
    workOrder.status
  )

  if (loadingAppointmentDetails) {
    return <Spinner />
  }

  if (appointmentDetailsError) {
    return <ErrorMessage label={appointmentDetailsError} />
  }

  return (
    <>
      <AppointmentDetails
        workOrder={workOrder}
        appointmentDetails={appointmentDetails}
      />
      <div className="lbh-body-xs govuk-!-margin-top-1">
        <span>Assigned to: {workOrder.owner}</span>
      </div>
      {workOrder.closedDated && (
        <div className="lbh-body-xs">
          <span>
            <strong>
              {workOrder.completionReason()}:{' '}
              {formatDateTime(new Date(workOrder.closedDated))}
            </strong>
          </span>
        </div>
      )}

      {'followOnRequest' in workOrder && workOrder.followOnRequest !== null && (
        <FurtherWorkRequiredFlag />
      )}

      {appointmentDetails.operatives.length > 0 &&
        ((appointmentDetails.appointment &&
          appointmentDetails.appointmentISODatePassed()) ||
          readOnly) && (
          <Operatives operatives={appointmentDetails.operatives} />
        )}
    </>
  )
}

export default WorkOrderAppointmentDetailsHeader
