import { addDays, addMinutes, subDays, subMinutes } from 'date-fns'
import format from 'date-fns/format'
import MockDate from 'mockdate'
import { WorkOrderAppointmentDetails } from './workOrderAppointmentDetails'

describe('WorkOrder', () => {
  describe('WorkOrderAppointmentDetails()', () => {
    it('returns false when there is no appointment', () => {
      const appointmentDetails = new WorkOrderAppointmentDetails()

      expect(appointmentDetails.appointmentISODatePassed()).toBe(false)
    })

    it('returns true when the current date is the same as the appointment start date with past time', () => {
      const now = new Date()

      const date = format(now, 'yyyy-MM-dd')
      const start = format(now, 'HH:mm')

      const appointmentDetails = new WorkOrderAppointmentDetails({
        appointment: { date, start },
      })

      MockDate.set(addMinutes(now, 1))

      expect(appointmentDetails.appointmentISODatePassed()).toBe(true)
    })

    it('returns true when the current date is the same as the appointment start date with before time', () => {
      const now = new Date()

      const date = format(now, 'yyyy-MM-dd')
      const start = format(now, 'HH:mm')

      const appointmentDetails = new WorkOrderAppointmentDetails({
        appointment: { date, start },
      })

      MockDate.set(subMinutes(now, 1))

      expect(appointmentDetails.appointmentISODatePassed()).toBe(true)
    })

    it('returns false when the current date is before the appointment date', () => {
      const now = new Date()

      const date = format(now, 'yyyy-MM-dd')
      const start = format(now, 'HH:mm')

      const appointmentDetails = new WorkOrderAppointmentDetails({
        appointment: { date, start },
      })

      MockDate.set(subDays(now, 1))

      expect(appointmentDetails.appointmentISODatePassed()).toBe(false)
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
        const appointmentDetails = new WorkOrderAppointmentDetails({
          appointment: { date, start },
        })

        expect(appointmentDetails.appointmentIsToday()).toBe(false)
      })
    })

    describe('when the appointment is today', () => {
      beforeEach(() => {
        MockDate.set(now)
      })

      it('returns true', () => {
        const appointmentDetails = new WorkOrderAppointmentDetails({
          appointment: { date, start },
        })

        expect(appointmentDetails.appointmentIsToday()).toBe(true)
      })
    })

    describe('when the appointment was yesterday', () => {
      beforeEach(() => {
        MockDate.set(addDays(now, 1))
      })

      it('returns false', () => {
        const appointmentDetails = new WorkOrderAppointmentDetails({
          appointment: { date, start },
        })

        expect(appointmentDetails.appointmentIsToday()).toBe(false)
      })
    })
  })
})
