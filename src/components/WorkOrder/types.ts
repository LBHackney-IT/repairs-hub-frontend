export type WorkOrderAppointmentDetails = {
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
  operatives: object[]
  externalAppointmentManagementUrl: string
  plannerComments: string
}
