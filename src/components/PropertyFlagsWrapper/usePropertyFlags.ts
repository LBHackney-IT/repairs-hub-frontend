import { CautionaryAlert } from '@/root/src/models/cautionaryAlerts'
import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import { getAlerts } from '@/root/src/utils/requests/property'
import { useEffect, useState } from 'react'

export const usePropertyFlags = (propertyReference: string) => {
  const [legalDisrepairError, setLegalDisRepairError] = useState<string>()
  const [isInLegalDisrepair, setIsInLegalDisrepair] = useState()

  const [alerts, setAlerts] = useState<CautionaryAlert[]>([])
  const [alertsError, setAlertsError] = useState<string | null>()

  const [loading, setLoading] = useState(false)

  const getPropertyInfoOnLegalDisrepair = (propertyReference) => {
    return new Promise<void>((resolve) => {
      frontEndApiRequest({
        method: 'get',
        path: `/api/properties/legalDisrepair/${propertyReference}`,
      })
        .then((isInLegalDisrepair) => {
          setIsInLegalDisrepair(isInLegalDisrepair.propertyIsInLegalDisrepair)
          resolve()
        })
        .catch((error) => {
          console.error('Error loading legal disrepair status:', error.response)
          setLegalDisRepairError(
            `Error loading legal disrepair status: ${error.response?.status} with message: ${error.response?.data?.message}`
          )
          resolve()
        })
    })
  }

  const fetchAlerts = async (propertyReference: string) => {
    const alertsResponse = await getAlerts(propertyReference)

    if (!alertsResponse.success) {
      setAlertsError(alertsResponse.error.message)
      return
    }

    setAlerts(alertsResponse.response.alerts)
  }

  const fetchPropertyFlags = async (propertyReference: string) => {
    setLoading(true)

    await getPropertyInfoOnLegalDisrepair(propertyReference)
    await fetchAlerts(propertyReference)
    setLoading(false)
  }

  useEffect(() => {
    fetchPropertyFlags(propertyReference)
  }, [])

  return {
    isInLegalDisrepair,
    legalDisrepairError,
    alerts,
    alertsError,
    loading,
  }
}
