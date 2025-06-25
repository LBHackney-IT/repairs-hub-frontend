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
  otherTrade?: string
}
