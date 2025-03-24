import { useContext, useEffect, useRef, useState } from 'react'
import { WorkOrder } from '../../models/workOrder'
import ScheduleDRSAppointmentLink from './ScheduleDRSAppointmentLink'
import { buildDataFromScheduleAppointment } from '../../utils/hact/jobStatusUpdate/notesForm'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import UserContext from '../UserContext'
import { getOrCreateSchedulerSessionId } from '../../utils/frontEndApiClient/users/schedulerSession'
import ErrorMessage from '../Errors/ErrorMessage'
import Spinner from '../Spinner'

interface Props {
  hasExistingAppointment: boolean
  workOrder: WorkOrder
  externalAppointmentManagementUrl: string
  workOrderReference: string
}

const ScheduleAppointment = (props: Props) => {
  const { hasExistingAppointment, workOrder, workOrderReference } = props

  const [schedulerSessionId, setSchedulerSessionId] = useState<string | null>(
    null
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const { user } = useContext(UserContext)
  const userOpenedWBM = useRef(false)
  const focusRef = useRef(null)

  const onWindowFocusCallback = () => {
    if (!userOpenedWBM.current) return

    // refresh page to trigger manual sync
    window.location.reload()
  }

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
      getSchedulerSessionId()
    }, 500)
  }

  useEffect(() => {
    const ref = window.addEventListener('focus', onWindowFocusCallback, false)

    focusRef.current = ref

    return () => {
      window.removeEventListener(focusRef.current, onWindowFocusCallback, false)
    }
  }, [])

  const getSchedulerSessionId = async () => {
    setIsLoading(true)

    getOrCreateSchedulerSessionId()
      .then((schedulerSessionId) => {
        setSchedulerSessionId(schedulerSessionId)
      })
      .catch((error) => {
        console.error(error)
        setError('Something went wrong fetching DRS Session: ' + error?.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    getSchedulerSessionId()
  }, [])

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
      openLinkEventHandler={openExternalLinkEventHandler}
      schedulerSessionId={schedulerSessionId}
      hasExistingAppointment={hasExistingAppointment}
      appointmentIsToday={workOrder.appointmentIsToday()}
      workOrder={workOrder}
    />
  )
}

export default ScheduleAppointment
