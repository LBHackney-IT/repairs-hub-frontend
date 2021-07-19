import {
  EMERGENCY_PRIORITY_CODE,
  IMMEDIATE_PRIORITY_CODE,
} from '../utils/helpers/priorities'

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
}
