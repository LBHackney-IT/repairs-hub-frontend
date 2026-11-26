import { getCautionaryAlertsRequest } from '@/requests/property'
import { useApiRequest } from './useApiRequest'

export const useCautionaryAlerts = (propertyReference?: string) => {
  const { data, error, isLoading } = useApiRequest(
    () => getCautionaryAlertsRequest(propertyReference),
    { enabled: !!propertyReference }
  )

  return { alerts: data?.alerts ?? [], error, isLoading }
}
