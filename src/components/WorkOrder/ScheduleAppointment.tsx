import { useContext, useEffect, useRef } from 'react'
import { WorkOrder } from '../../models/workOrder'
import ScheduleDRSAppointmentLink from './ScheduleDRSAppointmentLink'
import ScheduleInternalAppointmentLink from './ScheduleInternalAppointmentLink'
import { buildDataFromScheduleAppointment } from '../../utils/hact/jobStatusUpdate/notesForm'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import UserContext from '../UserContext'

interface Props {
  hasExistingAppointment: boolean
  workOrder: WorkOrder
  schedulerSessionId: string
  //   openExternalLinkEventHandler: () => void
  externalAppointmentManagementUrl: string
  workOrderReference: string
  resetSchedulerSessionId: () => void
}

const ScheduleAppointment = (props: Props) => {
  const {
    hasExistingAppointment,
    workOrder,
    schedulerSessionId,
    // openExternalLinkEventHandler,
    externalAppointmentManagementUrl,
    workOrderReference,
    resetSchedulerSessionId,
  } = props

  const { user } = useContext(UserContext)

  const userOpenedWBM = useRef(false)
  const focusRef = useRef(null)

  const onWindowFocusCallback = () => {
    if (!userOpenedWBM.current) return

    // refresh page to trigger manual sync
    window.location.reload()
  }

  useEffect(() => {
    const ref = window.addEventListener('focus', onWindowFocusCallback, false)

    focusRef.current = ref

    return () => {
      window.removeEventListener(focusRef.current, onWindowFocusCallback, false)
    }
  }, [])

  const openExternalLinkEventHandler = async () => {
    userOpenedWBM.current = true

    const jobStatusUpdate = buildDataFromScheduleAppointment(
      workOrderReference.toString(),
      `${user.name} opened the DRS Web Booking Manager`
    )

    await frontEndApiRequest({
      method: 'post',
      path: `/api/jobStatusUpdate`,
      requestData: jobStatusUpdate,
    })

    setTimeout(() => {
      // sessionId is single use, so reset it
      resetSchedulerSessionId()
    }, 500)
  }

  if (!externalAppointmentManagementUrl) {
    return (
      <ScheduleInternalAppointmentLink
        workOrderReference={workOrderReference}
        hasExistingAppointment={hasExistingAppointment}
        appointmentIsToday={workOrder.appointmentIsToday()}
      />
    )
  }

  if (schedulerSessionId) {
    return (
      <ScheduleDRSAppointmentLink
        workOrder={workOrder}
        schedulerSessionId={schedulerSessionId}
        openLinkEventHandler={openExternalLinkEventHandler}
        hasExistingAppointment={hasExistingAppointment}
        appointmentIsToday={workOrder.appointmentIsToday()}
      />
    )
  } else {
    console.error('Scheduler Session ID does not exist')
  }
}

export default ScheduleAppointment
