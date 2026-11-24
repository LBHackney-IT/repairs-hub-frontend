import { getWorkOrderDetailsRequest } from '@/requests/workOrders'
import { useApiRequest } from './useApiRequest'

export const useWorkOrder = (workOrderReference: string) => {
  const { data, error, isLoading } = useApiRequest(() =>
    getWorkOrderDetailsRequest(workOrderReference)
  )

  return { workOrder: data, error, isLoading }
}
