import {
  HIGH_PRIORITY_CODES,
  PLANNED_PRIORITY_CODE,
  PRIORITY_CODES_REQUIRING_APPOINTMENTS,
} from '@/utils/helpers/priorities'

import {
  CLOSED_STATUS_DESCRIPTIONS,
  CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES,
} from '@/utils/statusCodes'
import { FollowOnRequest } from './followOnRequest'

export class WorkOrder {
  reference: string
  description: string
  // externalAppointmentManagementUrl: string
  startTime: string
  // appointment: Appointment
  status: string
  dateRaised: string
  tradeDescription: string
  isFollowOn: boolean
  priorityCode: number
  contractorReference: string
  tradeCode: string
  target: string
  totalSMVs: number

  closedDated: string
  paymentType: string
  // operatives: Operative[]
  followOnRequest?: FollowOnRequest
  uploadedFileCount?: {
    totalFileCount: number
  }
  budgetCode
  owner
  priority: string
  raisedBy: string
  callerName: string
  callerNumber: string
  // plannerComments: string
  propertyReference: string
  property: string

  canAssignOperative: boolean
  isSplit: boolean

  constructor(workOrderData) {
    Object.assign(this, workOrderData)
  }

  isHigherPriority = () => {
    return HIGH_PRIORITY_CODES.includes(this.priorityCode)
  }

  isAppointmentRequired = () => {
    return PRIORITY_CODES_REQUIRING_APPOINTMENTS.includes(this.priorityCode)
  }

  isPlannedGasBreakdownJob = () => {
    return (
      this.priorityCode === PLANNED_PRIORITY_CODE &&
      this.contractorReference === 'H04'
    )
  }

  canBeScheduled = () => {
    return (
      this.statusAllowsScheduling() &&
      (this.isAppointmentRequired() || this.isPlannedGasBreakdownJob()) &&
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
