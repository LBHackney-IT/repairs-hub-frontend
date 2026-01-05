import Link from 'next/link'
import ScheduleWarning from './ScheduleWarning'
import { WorkOrder } from '../../models/workOrder'

interface Props {
  // workOrder: WorkOrder
  externalAppointmentManagementUrl: string
  schedulerSessionId: string
  openLinkEventHandler: () => void
  hasExistingAppointment: boolean
  appointmentIsToday: boolean
}

const ScheduleDRSAppointmentLink = (props: Props) => {
  const {
    // workOrder,
    externalAppointmentManagementUrl,
    schedulerSessionId,
    openLinkEventHandler,
    hasExistingAppointment,
    appointmentIsToday,
  } = props

  return (
    <>
      <Link
        href={`${externalAppointmentManagementUrl}&sessionId=${schedulerSessionId}`}
        legacyBehavior
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
