import { addMinutes, subMinutes } from 'date-fns'
import format from 'date-fns/format'
import {
  EMERGENCY_PRIORITY_CODE,
  IMMEDIATE_PRIORITY_CODE,
  NORMAL_PRIORITY_CODE,
  URGENT_PRIORITY_CODE,
} from '../utils/helpers/priorities'
import {
  CLOSED_STATUS_DESCRIPTIONS,
  STATUS_COMPLETE,
  WORK_ORDERS_STATUSES,
} from '../utils/status-codes'
import { WorkOrder } from './work-order'
import MockDate from 'mockdate'

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

  describe('canBeScheduled()', () => {
    WORK_ORDERS_STATUSES.filter(
      (status) => !CLOSED_STATUS_DESCRIPTIONS.includes(status)
    ).forEach((status) => {
      it('returns true', () => {
        const workOrder = new WorkOrder({ status })

        expect(workOrder.canBeScheduled()).toBe(true)
      })
    })

    CLOSED_STATUS_DESCRIPTIONS.forEach((status) => {
      it('returns false', () => {
        const workOrder = new WorkOrder({ status })

        expect(workOrder.canBeScheduled()).toBe(false)
      })
    })
    ;[(URGENT_PRIORITY_CODE, NORMAL_PRIORITY_CODE)].forEach((code) => {
      it('returns true', () => {
        const workOrder = new WorkOrder({ priorityCode: code })

        expect(workOrder.canBeScheduled()).toBe(true)
      })
    })
    ;[(IMMEDIATE_PRIORITY_CODE, EMERGENCY_PRIORITY_CODE)].forEach((code) => {
      it('returns false', () => {
        const workOrder = new WorkOrder({ priorityCode: code })

        expect(workOrder.canBeScheduled()).toBe(false)
      })
    })
  })

  describe('appointmentStartTimePassed()', () => {
    it('returns false when there is no appointment', () => {
      const workOrder = new WorkOrder()

      expect(workOrder.appointmentStartTimePassed()).toBe(false)
    })

    it('returns true when the current time is past the appointment start time', () => {
      const now = new Date()

      const date = format(now, 'yyyy-MM-dd')
      const start = format(now, 'HH:mm')

      const workOrder = new WorkOrder({ appointment: { date, start } })

      MockDate.set(addMinutes(now, 1))

      expect(workOrder.appointmentStartTimePassed()).toBe(true)
    })

    it('returns false when the current time is before the appointment start time', () => {
      const now = new Date()

      const date = format(now, 'yyyy-MM-dd')
      const start = format(now, 'HH:mm')

      const workOrder = new WorkOrder({ appointment: { date, start } })

      MockDate.set(subMinutes(now, 1))

      expect(workOrder.appointmentStartTimePassed()).toBe(false)
    })
  })

  describe('completionReason()', () => {
    it('returns Completed when the status is work complete', () => {
      const workOrder = new WorkOrder({ status: STATUS_COMPLETE.description })

      expect(workOrder.completionReason()).toBe('Completed')
    })

    WORK_ORDERS_STATUSES.filter(
      (status) => status !== STATUS_COMPLETE.description
    ).forEach((status) => {
      it(`returns the status description when the status is ${status}`, () => {
        const workOrder = new WorkOrder({ status })

        expect(workOrder.completionReason()).toBe(status)
      })
    })
  })

  describe('targetTimePassed()', () => {
    it('returns true when the current time is past the target time', () => {
      const now = new Date()

      const workOrder = new WorkOrder({ target: now })

      MockDate.set(addMinutes(now, 1))

      expect(workOrder.targetTimePassed()).toBe(true)
    })

    it('returns false when the current time is before the target time', () => {
      const now = new Date()

      const workOrder = new WorkOrder({ target: now })

      MockDate.set(subMinutes(now, 1))

      expect(workOrder.appointmentStartTimePassed()).toBe(false)
    })
  })
})
