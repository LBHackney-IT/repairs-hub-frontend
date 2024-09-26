export type Note = {
  note: string
  user: string
  time: Date
  userEmail: string

  noteGeneratedOnFrontend: boolean
  typeCode: string
  otherType: string
}

export type WorkOrderRequest = {
  closedDate: Date
  paymentType: string
  operatives: {
    name: string
    jobPercentage: number
  }[]
  followOnRequest?: FollowOnRequest
}

export type FollowOnRequest = {
  isSameTrade: boolean
  isDifferentTrades: boolean
  requiredFollowOnTrades: string[]
  isMultipleOperatives: boolean
  followOnTypeDescription: string
  stockItemsRequired: boolean
  nonStockItemsRequired: boolean
  materialNotes: string
  additionalNotes: string
}
