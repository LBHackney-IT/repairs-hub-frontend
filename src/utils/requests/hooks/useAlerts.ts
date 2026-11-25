import { getAlertsRequest } from '@/requests/property'
import { useApiRequest } from './useApiRequest'

export const useAlerts = (propertyReference?: string) => {
  const { data, error, isLoading } = useApiRequest(
    () => getAlertsRequest(propertyReference),
    { enabled: !!propertyReference }
  )

  return { alerts: data?.alerts ?? [], error, isLoading }
}
