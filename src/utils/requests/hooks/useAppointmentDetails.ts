import { WorkOrderAppointmentDetails } from '@/root/src/models/workOrderAppointmentDetails'
import { getAppointmentDetails } from '@/root/src/utils/requests/workOrders'
import { useEffect, useState } from 'react'

export const useAppointmentDetails = (workOrderReference: string) => {
  const [
    appointmentDetails,
    setAppointmentDetails,
  ] = useState<WorkOrderAppointmentDetails>()

  const [error, setError] = useState<string | null>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchAppointmentDetails = async () => {
    setError(null)
    setIsLoading(true)

    const appointmentDetailsResponse = await getAppointmentDetails(
      workOrderReference
    )

    if (!appointmentDetailsResponse.success) {
      setError(appointmentDetailsResponse.error.message)
    } else {
      setAppointmentDetails(appointmentDetailsResponse.response)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchAppointmentDetails()
  }, [])

  return {
    appointmentDetails,
    error,
    isLoading,
  }
}
