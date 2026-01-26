import Link from 'next/link'
import ScheduleWarning from './ScheduleWarning'

interface Props {
  workOrderReference: string
  hasExistingAppointment: boolean
  appointmentIsToday: boolean
}

const ScheduleInternalAppointmentLink = (props: Props) => {
  const {
    workOrderReference,
    hasExistingAppointment,
    appointmentIsToday,
  } = props

  const href = hasExistingAppointment
    ? `/work-orders/${workOrderReference}/appointment/edit`
    : `/work-orders/${workOrderReference}/appointment/new`

  const linkText = hasExistingAppointment
    ? 'Reschedule appointment'
    : 'Schedule appointment'

  return (
    <>
      <Link href={href} legacyBehavior>
        <a className="lbh-link">{linkText} (non DRS)</a>
      </Link>
      {appointmentIsToday && (
        <ScheduleWarning hasExistingAppointment={hasExistingAppointment} />
      )}
    </>
  )
}

export default ScheduleInternalAppointmentLink
