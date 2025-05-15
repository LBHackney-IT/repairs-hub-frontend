import { Appointment } from './appointment'
import { Operative } from './operativeModel'

export class WorkOrderAppointmentDetails {
  reference: string
  appointment: Appointment
  operatives: Operative[]
  externalAppointmentManagementUrl: string
  plannerComments: string
}
