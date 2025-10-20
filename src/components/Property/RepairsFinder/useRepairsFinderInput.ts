import { useEffect, useState } from 'react'
import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import { parseString } from 'xml2js'
import {
  MatchingSorCode,
  RepairsFinderExtractedData,
  RepairsFinderXmlResponse,
} from './types'

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

  // console.log("Side effect")

  useEffect(() => {
    // console.log({ touched })

    if (!touched) {
      setTouched(true)
      return
    }

    handleInputChange()
  }, [textInput])

  const handleInputChange = async () => {
    console.log('handle change')
    setExtractedXmlData(null)
    setMatchingSorCode(null)

    setError(null)

    const extractedData = await extractXmlData(textInput)
    setExtractedXmlData(extractedData)

    console.info({ extractedData })

    if (extractedData == null) {
      setError('Invalid code format')
      console.log('is invaldi')
      return
    }

    // setError(null)

    setIsLoading(true)

    try {
      const response: MatchingSorCode = await frontEndApiRequest({
        method: 'get',
        path: '/api/repairs-finder/matching-sor-codes',
        params: {
          sorCode: extractedData.sorCode,
          contractorReference: extractedData.contractorReference,
          propertyReference: propertyReference,
        },
      })

      // timeout makes it look cooler
      setTimeout(() => {
        setIsLoading(false)
        setMatchingSorCode(response)
        // setError(null)
      }, 2000)
    } catch (e) {
      console.error(e.message)
      setIsLoading(false)

      // console.log({ e }, e.message, e.response?.data)

      if (e?.message) {
        setError(e.message)
        return
      }

      setError('Something went wrong validating sorCode. Please try again')
    }
  }

  const extractXmlData = async (
    xmlContent: string
  ): Promise<RepairsFinderExtractedData> => {
    try {
      const result = await parseXML(xmlContent)

      if (!result.success) return null

      const {
        PRIORITY: [priority],
        QUANTITY: [quantity],
        SOR_CODE: [sorCode],
        SOR_COMMENTS: [comments],
      } = result.result.RF_INFO.SOR[0]

      const contractorReference = result.result.RF_INFO.WORK_PROGRAMME[0]

      return {
        sorCode,
        priority,
        quantity,
        comments,
        contractorReference,
      }
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const parseXML = (xml: string) =>
    new Promise<{
      success: boolean
      error: Error
      result: RepairsFinderXmlResponse
    }>((resolve) => {
      parseString(xml, (err, result) => {
        if (err) {
          resolve({ success: false, error: err, result: null })
          return
        }

        resolve({ success: true, error: null, result })
      })
    })

  return {
    extractedXmlData,
    error,
    isLoading,
    matchingSorCode,
    touched,
  }
}
