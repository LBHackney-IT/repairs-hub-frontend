import { formatISO, isSameDay } from 'date-fns'
import { Appointment } from './appointment'
import { Operative } from './operativeModel'

export class WorkOrderAppointmentDetails {
  reference: string
  appointment: Appointment
  operatives: Operative[]
  externalAppointmentManagementUrl: string
  plannerComments: string

  constructor(appointmentData) {
    Object.assign(this, appointmentData)
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
}
