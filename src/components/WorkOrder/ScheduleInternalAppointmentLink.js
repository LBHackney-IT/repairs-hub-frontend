import Link from 'next/link'
import ScheduleWarning from './ScheduleWarning'

const ScheduleInternalAppointmentLink = ({
  workOrderReference,
  hasExistingAppointment,
  appointmentIsToday,
}) => {
  const href = hasExistingAppointment
    ? `/work-orders/${workOrderReference}/appointment/edit`
    : `/work-orders/${workOrderReference}/appointment/new`

  const linkText = hasExistingAppointment
    ? 'Reschedule appointment'
    : 'Schedule appointment'

  return (
    <>
      <Link href={href} className="lbh-link">
        {linkText} (non DRS)
      </Link>
      {appointmentIsToday && (
        <ScheduleWarning hasExistingAppointment={hasExistingAppointment} />
      )}
    </>
  )
}

export default ScheduleInternalAppointmentLink
