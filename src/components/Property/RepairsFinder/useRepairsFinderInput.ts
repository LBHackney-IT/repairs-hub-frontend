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

  useEffect(() => {
    if (!touched) {
      setTouched(true)
      return
    }

    handleInputChange()
  }, [textInput])

  const handleInputChange = async () => {
    setExtractedXmlData(null)
    setMatchingSorCode(null)

    setError(null)

    const extractedData = await extractXmlData(textInput)
    setExtractedXmlData(extractedData)


    if (extractedData == null || !validateData(extractedData)) {
      setError('Invalid code format')
      return
    }



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

  const validateData = (data: RepairsFinderExtractedData) => {

    // console.log("validate", { data })

    if (checkIfNullOrEmpty(data.contractorReference)) return false;
    if (checkIfNullOrEmpty(data.sorCode)) return false;
    if (checkIfNullOrEmpty(data.priority)) return false;
    if (checkIfNullOrEmpty(data.quantity)) return false;
    if (checkIfNullOrEmpty(data.comments)) return false;

    // console.log("is valid")

    return true
  }

  const checkIfNullOrEmpty = (value: string) => {
    if (value == "" || value == null) return true
    return false
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
