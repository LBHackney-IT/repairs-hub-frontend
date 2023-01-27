export interface Trade {
  code: string
  name: string
}

export interface Contractor {
  contractorReference: string
  contractorName: string
  useExternalScheduleManager: boolean
  canAssignOperative: boolean
  perTradeAvailability: boolean
}

export interface NewSorCode {
  code: string
  cost: number
  standardMinuteValue: number
  shortDescription: string
  longDescription: string
}

export interface NewSorCodesRequestObject {
  contractReference: string
  tradeCode: string
  sorCodes: Array<NewSorCode>
}
