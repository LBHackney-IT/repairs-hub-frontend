import { useEffect, useState } from 'react'
import { SimpleFeatureToggleResponse } from '../pages/api/simple-feature-toggle'
import { fetchSimpleFeatureToggles } from '../utils/frontEndApiClient/requests'

export const useSimpleFeatureToggles = (): [
  SimpleFeatureToggleResponse,
  boolean
] => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [
    simpleFeatureToggles,
    setSimpleFeatureToggles,
  ] = useState<SimpleFeatureToggleResponse>()

  useEffect(() => {
    setIsLoading(true)

    fetchSimpleFeatureToggles()
      .then((fetchedFeatureToggles) => {
        setSimpleFeatureToggles(fetchedFeatureToggles)
      })
      .catch((err) => {
        console.error('failed to fetch feature toggles', err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return [simpleFeatureToggles, isLoading]
}
