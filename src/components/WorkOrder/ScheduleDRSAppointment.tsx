import { useContext, useEffect, useRef, useState } from 'react'
import { WorkOrder } from '../../models/workOrder'
import { buildDataFromScheduleAppointment } from '../../utils/hact/jobStatusUpdate/notesForm'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import UserContext from '../UserContext'
import { getOrCreateSchedulerSessionId } from '../../utils/frontEndApiClient/users/schedulerSession'
import ErrorMessage from '../Errors/ErrorMessage'
import ScheduleWarning from './ScheduleWarning'
import Link from 'next/link'

interface Props {
  hasExistingAppointment: boolean
  workOrder: WorkOrder
  workOrderReference: string
}

const ScheduleDRSAppointment = (props: Props) => {
  const { hasExistingAppointment, workOrder, workOrderReference } = props

  const { user } = useContext(UserContext)

  const userOpenedWBM = useRef(false)
  const focusRef = useRef(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [schedulerSessionId, setSchedulerSessionId] = useState<string>()

  const getSchedulerSessionId = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const schedulerSessionId = await getOrCreateSchedulerSessionId()

      setSchedulerSessionId(schedulerSessionId)
      setIsLoading(false)
    } catch (e) {
      console.error('error fetching drs session')

      setIsLoading(false)
      setError('Failed to open DRS session: ' + e.message)
      console.info({ e })
    }
  }

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

  useEffect(() => {
    if (workOrder == null) return

    getSchedulerSessionId()
  }, [workOrder])

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

  if (isLoading) {
    return <p style={{ color: '#666', fontSize: 14 }}>Opening DRS Session...</p>
  }

  return (
    <>
      {schedulerSessionId && (
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
      )}

      {workOrder.appointmentIsToday() && (
        <ScheduleWarning hasExistingAppointment={hasExistingAppointment} />
      )}

      {error && <ErrorMessage label={error} />}
    </>
  )
}

export default ScheduleDRSAppointment
