import { parseString } from 'xml2js'
import { Priority } from '@/root/src/models/priority'

export const isOutOfHoursGas = (
  contractorReference: string,
  tradeCode: string
) => {
  const gasBreakdownContractorReference = 'H04'
  const oohTradeCode = 'OO'

  if (contractorReference != gasBreakdownContractorReference) return false // contractor must be "H04"
  return tradeCode == oohTradeCode
}

export const getPriorityObjectByCode = (
  code: number,
  priorities: Priority[]
) => {
  return priorities.find((priority) => priority.priorityCode == code)
}

export interface RepairsFinderExtractedData {
  sorCode: string
  priority: string
  quantity: string
  tradeCode: string
  comments: string
  contractorReference: string
}

export const extractXmlData = async (
  xmlContent: string
): Promise<RepairsFinderExtractedData> => {
  try {
    const result = await handleParseXML(xmlContent)

    if (!result.success) {
      return null
    }

    console.log({ result })

    let {
      PRIORITY: [priority],
      QUANTITY: [quantity],
      SOR_CODE: [sorCode],
      SOR_COMMENTS: [comments],
      SOR_CLASS: [tradeCode],
    } = result.result.RF_INFO.SOR[0]

    let contractorReference = result.result.RF_INFO.WORK_PROGRAMME[0]

    // temp override
    sorCode = '20060020'
    priority = '4' // 'Normal'
    quantity = '1'
    tradeCode = 'PL'
    comments = 'Sink top is loose - sadfsdf'
    contractorReference = 'H01'

    return {
      sorCode,
      priority,
      quantity,
      tradeCode,
      comments,
      contractorReference,
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

interface RepairsFinderXmlContent {
  RF_INFO: {
    RESULT: string[]
    PROPERTY: string[]
    WORK_PROGRAMME: string[]
    CAUSED_BY: string[]
    NOTIFIED_DEFECT: string[]
    DEFECT: Array<{
      DEFECT_CODE: string[]
      DEFECT_LOC_CODE: string[]
      DEFECT_COMMENTS: string[]
      DEFECT_PRIORITY: string[]
      DEFECT_QUANTITY: string[]
    }>
    SOR: Array<{
      SOR_CODE: string[]
      PRIORITY: string[]
      QUANTITY: string[]
      SOR_LOC_CODE: string[]
      SOR_COMMENTS: string[]
      SOR_CLASS: string[]
    }>
  }
}

const handleParseXML = (xml: string) =>
  new Promise<{
    success: boolean
    error: Error
    result: RepairsFinderXmlContent
  }>((resolve) => {
    parseString(xml, (err, result) => {
      if (err) {
        resolve({ success: false, error: err, result: null })
        return
      }

      resolve({ success: true, error: null, result })
    })
  })
