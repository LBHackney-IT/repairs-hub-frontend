import { useEffect, useState } from 'react'
import { fetchSimpleFeatureToggles } from '../requests'
import { SimpleFeatureToggleResponse } from '@/root/src/pages/api/simple-feature-toggle'

export const useFeatureToggles = () => {
  const [simpleFeatureToggles, setSimpleFeatureToggles] =
    useState<SimpleFeatureToggleResponse>()

  useEffect(() => {
    fetchSimpleFeatureToggles().then((fetchedFeatureToggles) => {
      setSimpleFeatureToggles(fetchedFeatureToggles)
    })
  }, [])

  return {
    simpleFeatureToggles,
  }
}
