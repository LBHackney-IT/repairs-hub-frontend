import { addDays, addMinutes, subDays, subMinutes } from 'date-fns'
import format from 'date-fns/format'
import {
  EMERGENCY_PRIORITY_CODE,
  IMMEDIATE_PRIORITY_CODE,
  NORMAL_PRIORITY_CODE,
  URGENT_PRIORITY_CODE,
} from '@/utils/helpers/priorities'
import {
  CLOSED_STATUS_DESCRIPTIONS,
  CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES,
  STATUS_COMPLETE,
  WORK_ORDERS_STATUSES,
} from '@/utils/statusCodes'
import { WorkOrder } from './workOrder'
import MockDate from 'mockdate'

describe('WorkOrder', () => {
  describe('priorityText()', () => {
    it('returns the priority with the last space-separated word capitalised', () => {
      const workOrder = new WorkOrder({ priority: 'other words URGENT' })

      expect(workOrder.priorityText()).toBe('Urgent')
    })
  })

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

  describe('appointmentISODatePassed()', () => {
    it('returns false when there is no appointment', () => {
      const workOrder = new WorkOrder()

      expect(workOrder.appointmentISODatePassed()).toBe(false)
    })

    it('returns true when the current date is the same as the appointment start date with past time', () => {
      const now = new Date()

      const date = format(now, 'yyyy-MM-dd')
      const start = format(now, 'HH:mm')

      const workOrder = new WorkOrder({ appointment: { date, start } })

      MockDate.set(addMinutes(now, 1))

      expect(workOrder.appointmentISODatePassed()).toBe(true)
    })

    it('returns true when the current date is the same as the appointment start date with before time', () => {
      const now = new Date()

      const date = format(now, 'yyyy-MM-dd')
      const start = format(now, 'HH:mm')

      const workOrder = new WorkOrder({ appointment: { date, start } })

      MockDate.set(subMinutes(now, 1))

      expect(workOrder.appointmentISODatePassed()).toBe(true)
    })

    it('returns false when the current date is before the appointment date', () => {
      const now = new Date()

      const date = format(now, 'yyyy-MM-dd')
      const start = format(now, 'HH:mm')

      const workOrder = new WorkOrder({ appointment: { date, start } })

      MockDate.set(subDays(now, 1))

      expect(workOrder.appointmentISODatePassed()).toBe(false)
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

      expect(workOrder.targetTimePassed()).toBe(false)
    })
  })

  describe('appointmentIsToday()', () => {
    const now = new Date()

    const date = format(now, 'yyyy-MM-dd')
    const start = format(now, 'HH:mm')

    describe('when the appointment is tomorrow', () => {
      beforeEach(() => {
        MockDate.set(subDays(now, 1))
      })

      it('returns false', () => {
        const workOrder = new WorkOrder({ appointment: { date, start } })

        expect(workOrder.appointmentIsToday()).toBe(false)
      })
    })

    describe('when the appointment is today', () => {
      beforeEach(() => {
        MockDate.set(now)
      })

      it('returns true', () => {
        const workOrder = new WorkOrder({ appointment: { date, start } })

        expect(workOrder.appointmentIsToday()).toBe(true)
      })
    })

    describe('when the appointment was yesterday', () => {
      beforeEach(() => {
        MockDate.set(addDays(now, 1))
      })

      it('returns false', () => {
        const workOrder = new WorkOrder({ appointment: { date, start } })

        expect(workOrder.appointmentIsToday()).toBe(false)
      })
    })
  })

  describe('hasBeenVisited()', () => {
    CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES.forEach((status) => {
      it(`returns true when the status is ${status}`, () => {
        const workOrder = new WorkOrder({ status })

        expect(workOrder.hasBeenVisited()).toBe(true)
      })
    })

    it('returns false for a non visited status', () => {
      const workOrder = new WorkOrder({ status: 'In Progress' })

      expect(workOrder.hasBeenVisited()).toBe(false)
    })
  })
})
