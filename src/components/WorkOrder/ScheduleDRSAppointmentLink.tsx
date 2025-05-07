import Link from 'next/link'
import ScheduleWarning from './ScheduleWarning'

interface Props {
  schedulerSessionId: string
  openLinkEventHandler: () => void
  hasExistingAppointment: boolean
  appointmentIsToday: boolean
  externalAppointmentManagementUrl: string
}

const ScheduleDRSAppointmentLink = (props: Props) => {
  const {
    schedulerSessionId,
    openLinkEventHandler,
    hasExistingAppointment,
    appointmentIsToday,
    externalAppointmentManagementUrl,
  } = props

  return (
    <>
      <Link
        href={`${externalAppointmentManagementUrl}&sessionId=${schedulerSessionId}`}
      >
        <a
          className="lbh-link"
          target="_blank"
          rel="noopener"
          onClick={openLinkEventHandler}
        >
          <strong>Open DRS</strong> to{' '}
          {hasExistingAppointment ? 'reschedule' : 'book an'} appointment
        </a>
      </Link>
      {appointmentIsToday && (
        <ScheduleWarning hasExistingAppointment={hasExistingAppointment} />
      )}
    </>
  )
}

export default ScheduleDRSAppointmentLink
