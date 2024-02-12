import Link from 'next/link'
import ScheduleWarning from './ScheduleWarning'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import { buildDataFromScheduleAppointment } from '../../utils/hact/jobStatusUpdate/notesForm'
import { useEffect, useState } from 'react'
import { getOrCreateSchedulerSessionId } from '../../utils/frontEndApiClient/users/schedulerSession'

const ScheduleDRSAppointmentLink = ({
  workOrder,
  // schedulerSessionId,
  hasExistingAppointment,
  appointmentIsToday,
}) => {

  const [schedulerSessionId, setSchedulerSessionId] = useState("")

  const getSessionId = async () => {
    const schedulerSessionId = await getOrCreateSchedulerSessionId()
    setSchedulerSessionId(schedulerSessionId)
  }

  useEffect(() => {
   getSessionId()

  }, [])
  // const schedulerSessionId = ""

  const openExternalLinkEventHandler = async () => {
    // const jobStatusUpdate = buildDataFromScheduleAppointment(
    //   workOrder.reference.toString(),
    //   `${user.name} opened the DRS Web Booking Manager`
    // )

    // await frontEndApiRequest({
    //   method: 'post',
    //   path: `/api/jobStatusUpdate`,
    //   requestData: jobStatusUpdate,
    // })

    // await new Promise(resolve => {
    //   setTimeout(() => {
        
    //     resolve()
    //   }, 5000)
    // })
  }

if (schedulerSessionId === "") {
  return <></>
}

  return (
    <>
      <Link
    
        href={`${workOrder.externalAppointmentManagementUrl}&sessionId=${schedulerSessionId}`}
      >
        <a
          className="lbh-link"
          target="_blank"
          rel="noopener"
          onClick={openExternalLinkEventHandler}
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
