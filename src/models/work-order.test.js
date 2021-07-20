import {
  EMERGENCY_PRIORITY_CODE,
  IMMEDIATE_PRIORITY_CODE,
  NORMAL_PRIORITY_CODE,
  URGENT_PRIORITY_CODE,
} from '../utils/helpers/priorities'
import {
  CLOSED_STATUS_DESCRIPTIONS,
  WORK_ORDERS_STATUSES,
} from '../utils/status-codes'
import { WorkOrder } from './work-order'

describe('WorkOrder', () => {
  describe('isHigherPriority()', () => {
    ;[IMMEDIATE_PRIORITY_CODE, EMERGENCY_PRIORITY_CODE].forEach((code) => {
      it('returns true', () => {
        const workOrder = new WorkOrder({ priorityCode: code })

        expect(workOrder.isHigherPriority()).toBe(true)
      })
    })
    ;[URGENT_PRIORITY_CODE, NORMAL_PRIORITY_CODE].forEach((code) => {
      it('returns false', () => {
        const workOrder = new WorkOrder({ priorityCode: code })

        expect(workOrder.isHigherPriority()).toBe(false)
      })
    })
  })

  describe('statusAllowsScheduling()', () => {
    WORK_ORDERS_STATUSES.filter(
      (status) => !CLOSED_STATUS_DESCRIPTIONS.includes(status)
    ).forEach((status) => {
      it('returns true', () => {
        const workOrder = new WorkOrder({ status })

        expect(workOrder.statusAllowsScheduling()).toBe(true)
      })
    })

    CLOSED_STATUS_DESCRIPTIONS.forEach((status) => {
      it('returns false', () => {
        const workOrder = new WorkOrder({ status })

        expect(workOrder.statusAllowsScheduling()).toBe(false)
      })
    })
  })
})
