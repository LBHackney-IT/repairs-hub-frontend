import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import { buildDataFromScheduleAppointment } from '@/root/src/utils/hact/jobStatusUpdate/notesForm'
import { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '../../../UserContext'
import { getOrCreateSchedulerSessionId } from '../../../../utils/frontEndApiClient/users/schedulerSession'

export const useDrsAppointmentScheduler = (workOrderReference: string) => {
  const [schedulerSessionId, setSchedulerSessionId] = useState<string | null>(
    null
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const { user } = useContext(UserContext)
  const userOpenedWBM = useRef(false)

  const fetchSchedulerSessionId = async () => {
    setIsLoading(true)

    try {
      const sessionId = await getOrCreateSchedulerSessionId()
      setSchedulerSessionId(sessionId)
    } catch (err) {
      console.error(err)
      setError(
        `Something went wrong fetching DRS Session: ${
          err?.message || 'Unknown error'
        }`
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleExternalLinkOpen = async () => {
    userOpenedWBM.current = true

    const jobStatusUpdate = buildDataFromScheduleAppointment(
      workOrderReference.toString(),
      `${user.name} opened the DRS Web Booking Manager`
    )

    await frontEndApiRequest({
      method: 'post',
      path: '/api/jobStatusUpdate',
      requestData: jobStatusUpdate,
    })

    setTimeout(() => fetchSchedulerSessionId(), 500)
  }

  useEffect(() => {
    const handleWindowFocus = () => {
      if (userOpenedWBM.current) {
        window.location.reload()
      }
    }

    window.addEventListener('focus', handleWindowFocus)

    return () => {
      window.removeEventListener('focus', handleWindowFocus)
    }
  }, [])

  useEffect(() => {
    fetchSchedulerSessionId()
  }, [])

  return {
    schedulerSessionId,
    isLoading,
    error,
    handleExternalLinkOpen,
  }
}
