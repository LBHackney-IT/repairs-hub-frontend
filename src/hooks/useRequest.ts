import { useEffect, useState } from 'react'
import { APIResponseError, ApiResponseType } from '../types/requests/types'
import { formatRequestErrorMessage } from '../utils/errorHandling/formatErrorMessage'

export const useRequest = <T, R>(
  request: (params: T) => Promise<ApiResponseType<R>>,
  params: T,
  validateParams?: () => boolean
) => {
  const [result, setResult] = useState<R>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>()

  const executeRequest = async (params: T) => {
    setError(null)

    setIsLoading(true)

    try {
      const apiResponse = await request(params)
      if (!apiResponse.success) throw apiResponse.error

      setResult(apiResponse.response)
    } catch (e) {
      setResult(null)
      console.error('An error has occured:', e.response)

      if (e instanceof APIResponseError) {
        setError(e.message)
      } else {
        setError(formatRequestErrorMessage(e))
      }
    }

    setIsLoading(false)
  }

  useEffect(() => {
    if (validateParams && !validateParams()) return 

    executeRequest(params)
  }, [params])

  return {
    result,
    isLoading,
    error,
  }
}
