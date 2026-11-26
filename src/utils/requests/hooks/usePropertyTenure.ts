import { getPropertyTenureDataRequest } from '@/requests/property'
import { useApiRequest } from './useApiRequest'

export const usePropertyTenure = (propertyReference?: string) => {
  const { data, error, isLoading } = useApiRequest(
    () => getPropertyTenureDataRequest(propertyReference),
    { enabled: !!propertyReference }
  )

  return {
    property: data?.property,
    tenure: data?.tenure,
    error,
    isLoading,
  }
}
