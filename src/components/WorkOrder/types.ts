import { formatISO, isSameDay } from 'date-fns'

export class WorkOrderAppointmentDetails {
  reference: string
  appointment: {
    date: string
    description: string
    start: string
    end: string
    reason: string
    note: string
    assignedStart: string
    assignedEnd: string
    startedAt: string
    bookingLifeCycleStatus: string
  }
  operatives: {
    jobPercentage: number | null
    id: number
    payrollNumber: string
    name: string
    trades: string[]
    isOnejobatatime: boolean
  }[]
  externalAppointmentManagementUrl: string
  plannerComments: string

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
