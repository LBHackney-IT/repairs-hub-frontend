export interface RepairsFinderXmlResponse {
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

export interface RepairsFinderExtractedData {
  contractorReference: string
  sorCode: string
  priority: string
  quantity: string
  comments: string
}

export interface MatchingSorCode {
  sorCode: {
    code: string
    shortDescription: string
    longDescription: string
    priority: {
      priorityCode: number
      description: string
    }
    cost: number
    standardMinuteValue: number
    displayPriority: number
  }
  tradeCode: string
  trade: string
  contractReference: string
  contractorReference: string
  contractor: string
  hasPropertyContract: boolean
}
