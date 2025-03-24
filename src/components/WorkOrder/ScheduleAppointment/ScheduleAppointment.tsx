import { WorkOrder } from '../../../models/workOrder'
import ScheduleDRSAppointmentLink from '../ScheduleDRSAppointmentLink'
import ErrorMessage from '../../Errors/ErrorMessage'
import Spinner from '../../Spinner'
import { useDrsAppointmentScheduler } from './hooks/useDrsApppointmentScheduler'

interface Props {
  hasExistingAppointment: boolean
  workOrder: WorkOrder
  externalAppointmentManagementUrl: string
  workOrderReference: string
}

const ScheduleAppointment = ({
  hasExistingAppointment,
  workOrder,
  workOrderReference,
}: Props) => {
  const {
    schedulerSessionId,
    isLoading,
    error,
    handleExternalLinkOpen,
  } = useDrsAppointmentScheduler(workOrderReference)

  if (isLoading) {
    return (
      <span
        style={{
          color: '#64748b',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Spinner width={20} height={20} />
        <span style={{ margin: '0 0 0 10px' }}>Fetching DRS session...</span>
      </span>
    )
  }

  if (error) {
    return <ErrorMessage label={error} />
  }

  return (
    <ScheduleDRSAppointmentLink
      openLinkEventHandler={handleExternalLinkOpen}
      schedulerSessionId={schedulerSessionId}
      hasExistingAppointment={hasExistingAppointment}
      appointmentIsToday={workOrder.appointmentIsToday()}
      workOrder={workOrder}
    />
  )
}

export default ScheduleAppointment
