import { useEffect, useState } from 'react'
import { SimpleFeatureToggleResponse } from '../pages/api/simple-feature-toggle'
import { fetchSimpleFeatureTogglesRequest } from '@/requests/featureToggles'

export const useSimpleFeatureToggles = (): [
  SimpleFeatureToggleResponse,
  boolean,
  Error | null
] => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const [
    simpleFeatureToggles,
    setSimpleFeatureToggles,
  ] = useState<SimpleFeatureToggleResponse>()

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    fetchSimpleFeatureTogglesRequest()
      .then((fetchedFeatureToggles) => {
        setSimpleFeatureToggles(fetchedFeatureToggles)
      })
      .catch((err) => {
        console.error('failed to fetch feature toggles', err)
        setError(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return [simpleFeatureToggles, isLoading, error]
}
