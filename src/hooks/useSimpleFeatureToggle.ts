import { useEffect, useState } from 'react'
import { SimpleFeatureToggleResponse } from '../pages/api/simple-feature-toggle'
import { fetchSimpleFeatureToggles } from '../utils/frontEndApiClient/requests'

export const useSimpleFeatureToggles = () => {
  const [
    simpleFeatureToggles,
    setSimpleFeatureToggles,
  ] = useState<SimpleFeatureToggleResponse>()

  useEffect(() => {
    fetchSimpleFeatureToggles().then((fetchedFeatureToggles) => {
      setSimpleFeatureToggles(fetchedFeatureToggles)
    })
  }, [])

  return [simpleFeatureToggles]
}
