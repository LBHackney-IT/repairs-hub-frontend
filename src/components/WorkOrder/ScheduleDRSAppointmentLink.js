import Link from 'next/link'
import ScheduleWarning from './ScheduleWarning'

const ScheduleDRSAppointmentLink = ({
  workOrder,
  schedulerSessionId,
  openLinkEventHandler,
  hasExistingAppointment,
  appointmentIsToday,
}) => {
  return (
    <>
      <Link
        href={`${workOrder.externalAppointmentManagementUrl}&sessionId=${schedulerSessionId}`}
        className="lbh-link"
        target="_blank"
        rel="noopener"
        onClick={openLinkEventHandler}
      >
        <strong>Open DRS</strong>to{' '}
        {hasExistingAppointment ? 'reschedule' : 'book an'}appointment
      </Link>
      {appointmentIsToday && (
        <ScheduleWarning hasExistingAppointment={hasExistingAppointment} />
      )}
    </>
  )
}

export default ScheduleDRSAppointmentLink
