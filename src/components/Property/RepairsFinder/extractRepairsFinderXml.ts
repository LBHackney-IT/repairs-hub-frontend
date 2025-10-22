import { RepairsFinderExtractedData, RepairsFinderXmlResponse } from './types'
import { parseString } from 'xml2js'

interface ExtractResponse {
  success: boolean
  error: string | null
  result: RepairsFinderExtractedData | null
}

const extractRepairsFinderXml = async (
  textInput: string
): Promise<ExtractResponse> => {
  const extractedData = await extractXmlData(textInput)

  if (extractedData == null || !validateData(extractedData)) {
    return {
      error: 'Invalid code format',
      result: null,
      success: false,
    }
  }

  return {
    error: null,
    result: extractedData,
    success: true,
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
  if (checkIfNullOrEmpty(data?.contractorReference)) return false
  if (checkIfNullOrEmpty(data?.sorCode)) return false
  if (checkIfNullOrEmpty(data?.priority)) return false
  if (checkIfNullOrEmpty(data?.quantity)) return false
  if (checkIfNullOrEmpty(data?.comments)) return false

  return true
}

const checkIfNullOrEmpty = (value: string) => {
  if (value == '' || value == null) return true
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

export default extractRepairsFinderXml
