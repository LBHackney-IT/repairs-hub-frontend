import { getLegalDisrepairStatusRequest } from '@/requests/property'
import { useApiRequest } from './useApiRequest'

export const useLegalDisrepairStatus = (propertyReference?: string) => {
  const { data, error, isLoading } = useApiRequest(
    () => getLegalDisrepairStatusRequest(propertyReference),
    { enabled: !!propertyReference }
  )

  return {
    isInLegalDisrepair: data?.propertyIsInLegalDisrepair ?? null,
    error,
    isLoading,
  }
}
