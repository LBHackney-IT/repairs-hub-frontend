export type VariationResponseObject = {
  variation: Variation | null
}

export type Variation = {
  notes: string
  tasks: VariationTask[]
  authorName: string
  variationDate: Date
}

export type VariationTask = {
  id: string
  code: string
  description: string
  unitCost: number
  originalQuantity: number
  currentQuantity: number
  variedQuantity: number
}
