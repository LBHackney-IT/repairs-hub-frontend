import { formatISO, isSameDay } from 'date-fns'
import {
  EMERGENCY_PRIORITY_CODE,
  IMMEDIATE_PRIORITY_CODE,
} from '@/utils/helpers/priorities'

import {
  CLOSED_STATUS_DESCRIPTIONS,
  CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES,
  STATUS_COMPLETE,
} from '@/utils/statusCodes'

export class WorkOrder {
  constructor(workOrderData) {
    Object.assign(this, workOrderData)
  }

  priorityText = () => {
    const lowerCase = this.priority.toLowerCase().split(' ').slice(-1)[0]

    return lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1)
  }

  isHigherPriority = () => {
    return (
      this.priorityCode === EMERGENCY_PRIORITY_CODE ||
      this.priorityCode === IMMEDIATE_PRIORITY_CODE
    )
  }

  canBeScheduled = () => {
    return this.statusAllowsScheduling() && !this.isHigherPriority()
  }

  completionReason = () => {
    return this.status === STATUS_COMPLETE.description
      ? 'Completed'
      : this.status
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
