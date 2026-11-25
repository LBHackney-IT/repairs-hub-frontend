import { useEffect, useState } from 'react'
import { ApiResponseType } from '@/root/src/types/requests/types'

interface Options {
  // When false the request is not made (e.g. waiting on another response)
  enabled?: boolean
}

/**
 * Runs a request once on mount (or once `enabled` becomes true) and exposes
 * its data, loading and error state.
 */
export const useApiRequest = <T>(
  request: () => Promise<ApiResponseType<T>>,
  { enabled = true }: Options = {}
) => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSettled, setIsSettled] = useState<boolean>(false)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    setError(null)

    request().then((response) => {
      if (cancelled) return

      if (response.success) {
        setData(response.response)
      } else {
        setError(response.error.message)
      }

      setIsSettled(true)
    })

    return () => {
      cancelled = true
    }
  }, [enabled])

  // Derived (rather than set in the effect) so there is no render in which a
  // newly enabled request is neither loading nor settled
  return { data, error, isLoading: enabled && !isSettled }
}
