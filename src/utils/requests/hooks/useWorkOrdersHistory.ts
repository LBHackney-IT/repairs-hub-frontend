import { useEffect, useState } from 'react'
import { WorkOrder } from '@/models/workOrder'
import { getWorkOrdersHistoryRequest } from '@/requests/workOrders'

const PAGE_SIZE = 50

/**
 * Loads a property's work orders a page at a time. `loadMore` fetches the next
 * page and appends it to `workOrders`.
 */
export const useWorkOrdersHistory = (propertyReference: string) => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)
    setError(null)

    getWorkOrdersHistoryRequest(propertyReference, pageNumber, PAGE_SIZE).then(
      (response) => {
        if (cancelled) return

        if (response.success) {
          setWorkOrders((previous) =>
            pageNumber === 1
              ? response.response
              : [...previous, ...response.response]
          )
        } else {
          setError(response.error.message)
        }

        setIsLoading(false)
      }
    )

    return () => {
      cancelled = true
    }
  }, [propertyReference, pageNumber])

  return {
    workOrders,
    isLoading,
    error,
    // The API doesn't return a total, so a full page means there may be more
    hasMore: workOrders.length >= pageNumber * PAGE_SIZE,
    loadMore: () => setPageNumber((current) => current + 1),
  }
}
