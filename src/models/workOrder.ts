import {
  HIGH_PRIORITY_CODES,
  PRIORITY_CODES_REQUIRING_APPOINTMENTS,
} from '@/utils/helpers/priorities'

import {
  CLOSED_STATUS_DESCRIPTIONS,
  CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES,
} from '@/utils/statusCodes'

export class WorkOrder {
  reference: string
  description: string
  externalAppointmentManagementUrl: string | null
  startTime
  status
  dateRaised
  tradeDescription: string
  isFollowOn: boolean
  raisedBy
  callerName
  callerNumber
  closedDated
  owner

  budgetCode
  priorityCode
  contractorReference
  tradeCode
  target

  constructor(workOrderData) {
    Object.assign(this, workOrderData)
  }

  isHigherPriority = () => {
    return HIGH_PRIORITY_CODES.includes(this.priorityCode)
  }

  isAppointmentRequired = () => {
    return PRIORITY_CODES_REQUIRING_APPOINTMENTS.includes(this.priorityCode)
  }

  canBeScheduled = () => {
    return (
      this.statusAllowsScheduling() &&
      this.isAppointmentRequired() &&
      !this.isOutOfHoursGas()
    )
  }

  isOutOfHoursGas = () => {
    const gasBreakdownContractorReference = 'H04'
    const oohTradeCode = 'OO'

    const contractorReference = this.contractorReference

    if (contractorReference != gasBreakdownContractorReference) return false // contractor must be "H04"
    const tradeCode = this.tradeCode
    return tradeCode == oohTradeCode
  }

  completionReason = () => {
    return this.status === 'Work Completed' ? 'Completed' : this.status
  }

  statusAllowsScheduling = () => {
    return !CLOSED_STATUS_DESCRIPTIONS.includes(this.status)
  }

  targetTimePassed = () => {
    const currentTime = new Date().getTime()
    const targetTime = new Date(`${this.target}`).getTime()

    return currentTime > targetTime
  }

  hasBeenVisited = () =>
    CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES.includes(this.status)
}
