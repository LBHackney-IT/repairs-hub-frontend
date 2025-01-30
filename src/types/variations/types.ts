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

export type CurrentUser = {
  sub: string
  name: string
  email: string
  varyLimit: string
  raiseLimit: string
  contractors: any[] // Adjust!
  operativePayrollNumber: string | null
  isOneJobAtATime: boolean
}

export type Appointment = {
  date: string
  description: string
  start: string
  end: string
  reason: string
  note: string | null
  assignedStart: string
  assignedEnd: string
  startedAt: string
}

export type WorkOrderType = {
  appointment: Appointment
  reference: number
  dateRaised: string
  hasBeenVisited: () => boolean
  lastUpdated: string | null
  priority: string
  priorityCode: string | null
  property: string
  propertyPostCode: string
  owner: string
  description: string
  propertyReference: string
  tradeCode: string
  tradeDescription: string
  status: string
}

export type WorkOrdersType = WorkOrderType[]

export type UpdateWorkOrderDescriptionWorkOrderDetailsProps = {
  workOrderReference: string
}

export type FormValues = {
  editRepairDescription: string
}

export type WorkOrderEditDescriptionType = {
  reference: string
  description: string
  priorityCode: string
  status: string
  appointment?: { date: string; start: string }
  contractorReference?: string
  tradeCode?: string
  target?: string
}
