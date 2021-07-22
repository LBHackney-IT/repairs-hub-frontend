import {
  EMERGENCY_PRIORITY_CODE,
  IMMEDIATE_PRIORITY_CODE,
} from '../utils/helpers/priorities'

import {
  CLOSED_STATUS_DESCRIPTIONS,
  STATUS_COMPLETE,
} from '../utils/status-codes'

export class WorkOrder {
  constructor(workOrderData) {
    Object.assign(this, workOrderData)
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

  appointmentStartTimePassed = () => {
    if (
      !this.appointment ||
      !this.appointment.date ||
      !this.appointment.start
    ) {
      return false
    }

    const currentTime = new Date().getTime()

    const appointmentStartTime = new Date(
      `${this.appointment.date}T${this.appointment.start}`
    ).getTime()

    return currentTime > appointmentStartTime
  }

  statusAllowsScheduling = () => {
    return !CLOSED_STATUS_DESCRIPTIONS.includes(this.status)
  }

  targetTimePassed = () => {
    const currentTime = new Date().getTime()
    const targetTime = new Date(`${this.target}`).getTime()

    return currentTime > targetTime
  }
}
