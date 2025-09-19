import ScheduleDRSAppointmentLink from '../ScheduleDRSAppointmentLink'
import ErrorMessage from '../../Errors/ErrorMessage'
import Spinner from '../../Spinner'
import { useDrsAppointmentScheduler } from './hooks/useDrsApppointmentScheduler'
import { WorkOrderAppointmentDetails } from '@/root/src/models/workOrderAppointmentDetails'

interface Props {
  hasExistingAppointment: boolean
  appointmentDetails: WorkOrderAppointmentDetails
  workOrderReference: string
}

const ScheduleAppointment = ({
  hasExistingAppointment,
  appointmentDetails,
  workOrderReference,
}: Props) => {
  const { schedulerSessionId, isLoading, error, handleExternalLinkOpen } =
    useDrsAppointmentScheduler(workOrderReference)

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
      appointmentIsToday={appointmentDetails.appointmentIsToday()}
      externalAppointmentManagementUrl={
        appointmentDetails.externalAppointmentManagementUrl
      }
    />
  )
}

export default ScheduleAppointment
