import { CautionaryAlert } from '@/root/src/models/cautionaryAlerts'
import {
  getLegalDisrepairStatusRequest,
  getAlertsRequest,
} from '@/requests/property'
import { useEffect, useState } from 'react'

export const usePropertyFlags = (propertyReference: string) => {
  const [legalDisrepairError, setLegalDisRepairError] = useState<string>()
  const [isInLegalDisrepair, setIsInLegalDisrepair] = useState<boolean>()

  const [alerts, setAlerts] = useState<CautionaryAlert[]>([])
  const [alertsError, setAlertsError] = useState<string | null>()

  const [loading, setLoading] = useState(false)

  const getPropertyInfoOnLegalDisrepair = async (propertyReference: string) => {
    const response = await getLegalDisrepairStatusRequest(propertyReference)

    if (!response.success) {
      setLegalDisRepairError(response.error.message)
      return
    }

    setIsInLegalDisrepair(response.response.propertyIsInLegalDisrepair)
  }

  const fetchAlerts = async (propertyReference: string) => {
    const alertsResponse = await getAlertsRequest(propertyReference)

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
