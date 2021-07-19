import {
  EMERGENCY_PRIORITY_CODE,
  IMMEDIATE_PRIORITY_CODE,
  NORMAL_PRIORITY_CODE,
  URGENT_PRIORITY_CODE,
} from '../utils/helpers/priorities'
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
})
