export default interface Contractor {
  contractorReference: string
  contractorName: string
  activeContractCount: number
  useExternalScheduleManager: boolean
  canAssignOperative: boolean
  perTradeAvailability: boolean
  multiTradeEnabled: boolean
}
