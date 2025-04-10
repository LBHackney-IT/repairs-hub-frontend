import { formatISO, isSameDay } from 'date-fns'
import {
  HIGH_PRIORITY_CODES,
  PRIORITY_CODES_REQUIRING_APPOINTMENTS,
} from '@/utils/helpers/priorities'

import {
  CLOSED_STATUS_DESCRIPTIONS,
  CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES,
} from '@/utils/statusCodes'

export class WorkOrder {
  reference
  description
  externalAppointmentManagementUrl
  startTime
  appointment
  status

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

    var contractorReference = this.contractorReference

    if (contractorReference != gasBreakdownContractorReference) return false // contractor must be "H04"
    var tradeCode = this.tradeCode
    return tradeCode == oohTradeCode
  }

  completionReason = () => {
    return this.status === 'Work Completed' ? 'Completed' : this.status
  }

  appointmentISODatePassed = () => {
    if (
      !this.appointment ||
      !this.appointment.date ||
      !this.appointment.start
    ) {
      return false
    }

    const currentISODate = formatISO(new Date(), { representation: 'date' })

    const appointmentISODate = formatISO(
      new Date(`${this.appointment.date}T${this.appointment.start}`),
      { representation: 'date' }
    )

    return currentISODate >= appointmentISODate
  }

  appointmentIsToday = () => {
    if (
      !this.appointment ||
      !this.appointment.date ||
      !this.appointment.start
    ) {
      return false
    } else {
      return isSameDay(
        new Date(),
        new Date(`${this.appointment.date}T${this.appointment.start}`)
      )
    }
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
