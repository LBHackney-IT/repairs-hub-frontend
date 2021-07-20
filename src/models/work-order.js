import {
  EMERGENCY_PRIORITY_CODE,
  IMMEDIATE_PRIORITY_CODE,
  NORMAL_PRIORITY_CODE,
  URGENT_PRIORITY_CODE,
} from '../utils/helpers/priorities'

import { CLOSED_STATUS_DESCRIPTIONS } from '../utils/status-codes'

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

  isLowerPriority = () => {
    return (
      this.priorityCode === URGENT_PRIORITY_CODE ||
      this.priorityCode === NORMAL_PRIORITY_CODE
    )
  }

  statusAllowsScheduling = () => {
    return !CLOSED_STATUS_DESCRIPTIONS.includes(this.status)
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
}
