import { render } from '@testing-library/react'
import PrintJobTicketDetails from './PrintJobTicketDetails'
import { WorkOrder } from '../../models/workOrder'
import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'

const tasksAndSors = [
  {
    code: 'code',
    description: 'description',
    quantity: 2,
    standardMinuteValue: 2,
  },
]

const property = {
  address: {
    addressLine: '14 Pitcairn House St Thomass Square',
    streetSuffix: 'Dwelling',
    postalCode: 'E9 6PT',
  },
  tmoName: 'tmoName',
}

const alerts = []

describe('PrintJobTicketDetails component', () => {
  it('Renders the PrintJobTicketDetails component', () => {
    const workOrderData = {
      reference: '100',
      raisedBy: 'raisedBy',
      callerName: 'callerName',
      callerNumber: 'callerNumber',
      tradeCode: 'PL',
      contractorReference: 'contractorReference',
      priority: 'priority',
      description: 'description',
    }

    const appointmentDetails = {
      appointment: {
        date: '2021-01-18T15:28:57.17811',
        description: 'Appointment Description',
        note: 'Some appointment note',
      },
      operatives: [{ name: 'operative 1' }, { name: 'operative 2' }],
      plannerComments: 'plannerComments',
    }

    const { asFragment } = render(
      <PrintJobTicketDetails
        workOrder={new WorkOrder(workOrderData)}
        appointmentDetails={new WorkOrderAppointmentDetails(appointmentDetails)}
        property={property}
        tasksAndSors={tasksAndSors}
        alerts={alerts}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('Renders the PrintJobTicketDetails component with null values', () => {
    const workOrderData = {
      reference: '100',
      raisedBy: 'raisedBy',
      callerName: 'callerName',
      callerNumber: 'callerNumber',
      tradeCode: 'PL',
      contractorReference: 'contractorReference',
      priority: 'priority',
      description: 'description',
    }

    const appointmentDetails = {
      operatives: [],
      appointment: null,
      plannerComments: 'plannerComments',
    }

    const { asFragment } = render(
      <PrintJobTicketDetails
        workOrder={new WorkOrder(workOrderData)}
        appointmentDetails={new WorkOrderAppointmentDetails(appointmentDetails)}
        property={property}
        tasksAndSors={tasksAndSors}
        alerts={alerts}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
