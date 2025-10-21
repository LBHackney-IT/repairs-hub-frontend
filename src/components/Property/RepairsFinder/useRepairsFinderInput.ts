import { useEffect, useState } from 'react'
import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import { MatchingSorCode, RepairsFinderExtractedData } from './types'
import extractRepairsOnlineXml from './extractRepairsOnlineXml'

export const useRepairsFinderInput = (
  textInput: string,
  propertyReference: string
) => {
  const [
    extractedXmlData,
    setExtractedXmlData,
  ] = useState<RepairsFinderExtractedData | null>(null)

  const [
    matchingSorCode,
    setMatchingSorCode,
  ] = useState<MatchingSorCode | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [touched, setTouched] = useState<boolean>(false)

  useEffect(() => {
    if (!touched) {
      setTouched(true)
      return
    }

    handleInputChange()
  }, [textInput])

  const handleInputChange = async () => {
    setMatchingSorCode(null)

    const { error, result, success } = await extractRepairsOnlineXml(textInput)

    if (!success) {
      setExtractedXmlData(null)
      setError(error)
      return
    }

    setError(null)
    setExtractedXmlData(result)

    setIsLoading(true)

    try {
      const response: MatchingSorCode = await frontEndApiRequest({
        method: 'get',
        path: '/api/repairs-finder/matching-sor-codes',
        params: {
          sorCode: result.sorCode,
          contractorReference: result.contractorReference,
          propertyReference: propertyReference,
        },
      })

      // timeout makes it look cooler
      setTimeout(() => {
        setIsLoading(false)
        setMatchingSorCode(response)
      }, 2000)
    } catch (e) {
      console.error(e.message)
      setIsLoading(false)

      if (e?.message) {
        setError(e.message)
        return
      }

      setError('Something went wrong validating sorCode. Please try again')
    }
  }

  return {
    extractedXmlData,
    error,
    isLoading,
    matchingSorCode,
    touched,
  }
}
