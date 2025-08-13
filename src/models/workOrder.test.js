import { addMinutes, subMinutes } from 'date-fns'
import {
  EMERGENCY_PRIORITY_CODE,
  IMMEDIATE_PRIORITY_CODE,
  NORMAL_PRIORITY_CODE,
  URGENT_PRIORITY_CODE,
  SURVEY_PRIORITY_CODE,
  PLANNED_PRIORITY_CODE,
} from '@/utils/helpers/priorities'
import {
  CLOSED_STATUS_DESCRIPTIONS,
  CLOSED_STATUS_DESCRIPTIONS_FOR_OPERATIVES,
  STATUS_COMPLETED,
  WORK_ORDERS_STATUSES,
} from '@/utils/statusCodes'
import { WorkOrder } from './workOrder'
import MockDate from 'mockdate'

describe('WorkOrder', () => {
  describe('isHigherPriority()', () => {
    ;[IMMEDIATE_PRIORITY_CODE, EMERGENCY_PRIORITY_CODE].forEach((code) => {
      it(`returns true when the priorityCode is ${code}`, () => {
        const workOrder = new WorkOrder({ priorityCode: code })

        expect(workOrder.isHigherPriority()).toBe(true)
      })
    })
    ;[
      URGENT_PRIORITY_CODE,
      NORMAL_PRIORITY_CODE,
      SURVEY_PRIORITY_CODE,
      PLANNED_PRIORITY_CODE,
    ].forEach((code) => {
      it(`returns false when the priorityCode is ${code}`, () => {
        const workOrder = new WorkOrder({ priorityCode: code })

        expect(workOrder.isHigherPriority()).toBe(false)
      })
    })
  })

  describe('isAppointmentRequired()', () => {
    ;[URGENT_PRIORITY_CODE, NORMAL_PRIORITY_CODE, SURVEY_PRIORITY_CODE].forEach(
      (code) => {
        it(`returns true when the priorityCode is ${code}`, () => {
          const workOrder = new WorkOrder({ priorityCode: code })

          expect(workOrder.isAppointmentRequired()).toBe(true)
        })
      }
    )
    ;[
      IMMEDIATE_PRIORITY_CODE,
      EMERGENCY_PRIORITY_CODE,
      PLANNED_PRIORITY_CODE,
    ].forEach((code) => {
      it(`returns false when the priorityCode is ${code}`, () => {
        const workOrder = new WorkOrder({ priorityCode: code })

        expect(workOrder.isAppointmentRequired()).toBe(false)
      })
    })
  })

  describe('canBeScheduled()', () => {
    const allowedStatuses = WORK_ORDERS_STATUSES.filter(
      (status) => !CLOSED_STATUS_DESCRIPTIONS.includes(status)
    )

    allowedStatuses.forEach((status) => {
      it('returns true when valid status', () => {
        // Arrange
        const workOrder = new WorkOrder({
          status,
          priorityCode: NORMAL_PRIORITY_CODE,
        })

        workOrder.isOutOfHoursGas = jest.fn(() => false)

        // Act
        const result = workOrder.canBeScheduled()

        // Assert

        expect(result).toBe(true)
      })
    })

    CLOSED_STATUS_DESCRIPTIONS.forEach((status) => {
      it('returns false when invalid status', () => {
        // Arrange
        const workOrder = new WorkOrder({ status })

        workOrder.isOutOfHoursGas = jest.fn(() => false)

        // Act
        const result = workOrder.canBeScheduled()

        // Assert
        expect(result).toBe(false)
      })
    })

    const allowedPriorityCodes = [
      (URGENT_PRIORITY_CODE, NORMAL_PRIORITY_CODE, SURVEY_PRIORITY_CODE),
    ]

    allowedPriorityCodes.forEach((code) => {
      it(`returns true when allowed priority code`, () => {
        // Arrange
        const workOrder = new WorkOrder({ priorityCode: code })

        workOrder.isOutOfHoursGas = jest.fn(() => false)

        // Act
        const result = workOrder.canBeScheduled()

        // Assert
        expect(result).toBe(true)
      })
    })

    const disabledPriorities = [
      (IMMEDIATE_PRIORITY_CODE, EMERGENCY_PRIORITY_CODE, PLANNED_PRIORITY_CODE),
    ]

    disabledPriorities.forEach((code) => {
      it(`returns false when invalid priority code`, () => {
        // Arrange
        const workOrder = new WorkOrder({ priorityCode: code })

        workOrder.isOutOfHoursGas = jest.fn(() => false)

        // Act
        const result = workOrder.canBeScheduled()

        // Assert
        expect(result).toBe(false)
      })
    })

    it(`returns false when work order is out of hours gas`, () => {
      // Arrange
      const workOrder = new WorkOrder({
        contractorReference: 'H04',
        tradeCode: 'OO',
      })

      workOrder.statusAllowsScheduling = jest.fn(() => true)
      workOrder.isAppointmentRequired = jest.fn(() => true)

      // Act
      const result = workOrder.canBeScheduled()

      // Assert
      expect(result).toBe(false)
    })

    it(`returns true when work order is not out of hours gas`, () => {
      // Arrange
      const workOrder = new WorkOrder({
        contractorReference: 'H01',
        tradeCode: 'PL',
      })

      workOrder.statusAllowsScheduling = jest.fn(() => true)
      workOrder.isAppointmentRequired = jest.fn(() => true)

      // Act
      const result = workOrder.canBeScheduled()

      // Assert
      expect(result).toBe(true)
    })
  })

  describe('completionReason()', () => {
    it('returns Completed when the status is work complete', () => {
      const workOrder = new WorkOrder({ status: STATUS_COMPLETED.description })

      expect(workOrder.completionReason()).toBe('Completed')
    })

    WORK_ORDERS_STATUSES.filter(
      (status) =>
        status !== STATUS_COMPLETED.description && status !== 'Work Completed'
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
