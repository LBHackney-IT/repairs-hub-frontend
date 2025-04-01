jest.mock('./hooks/useDrsApppointmentScheduler', () => ({
  useDrsAppointmentScheduler: jest.fn(),
}))

import { useDrsAppointmentScheduler } from './hooks/useDrsApppointmentScheduler'

import { render } from '@testing-library/react'
import UserContext from '../../UserContext'
import { agent } from '@/root/factories/agent'
import { WorkOrder } from '@/root/src/models/workOrder'
import ScheduleAppointment from './ScheduleAppointment'

const workOrderData = {
  reference: 10000012,
  dateRaised: '2021-01-18T15:28:57.17811',
  lastUpdated: null,
  priority: 'A priority',
  property: '16 Pitcairn House  St Thomass Square',
  owner: 'HH General Building Repair - H01',
  description: 'This is a repair description',
  propertyReference: '00012345',
  status: 'In Progress',
  priorityCode: 0,
  raisedBy: 'Dummy Agent',
  target: '2021-01-23T18:30:00.00000',
  tradeCode: 'PL',
  tradeDescription: 'PLUMBING - PL',
  callerName: 'Jill Smith',
  callerNumber: '07700 900999',
  contractorReference: 'H01',
  appointment: null,
}

describe('AppointmentDetails component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Shows a loading state', () => {
    useDrsAppointmentScheduler.mockReturnValue({
      schedulerSessionId: 'schedulerSessionId',
      isLoading: true,
      error: null,
      handleExternalLinkOpen: jest.fn(),
    })

    let workOrder = new WorkOrder(workOrderData)

    const { asFragment } = render(
      <UserContext.Provider value={{ user: agent }}>
        <ScheduleAppointment
          workOrder={workOrder}
          hasExistingAppointment={false}
          workOrderReference={workOrder.reference}
        />
      </UserContext.Provider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('Shows an error state', () => {
    useDrsAppointmentScheduler.mockReturnValue({
      schedulerSessionId: null,
      isLoading: false,
      error: 'Some error occured',
      handleExternalLinkOpen: jest.fn(),
    })

    let workOrder = new WorkOrder(workOrderData)

    const { asFragment } = render(
      <UserContext.Provider value={{ user: agent }}>
        <ScheduleAppointment
          workOrder={workOrder}
          hasExistingAppointment={false}
          workOrderReference={workOrder.reference}
        />
      </UserContext.Provider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('Shows a success state', () => {
    useDrsAppointmentScheduler.mockReturnValue({
      schedulerSessionId: 'schedulerSessionId',
      isLoading: false,
      error: null,
      handleExternalLinkOpen: jest.fn(),
    })

    let workOrder = new WorkOrder(workOrderData)

    const { asFragment } = render(
      <UserContext.Provider value={{ user: agent }}>
        <ScheduleAppointment
          workOrder={workOrder}
          hasExistingAppointment={false}
          workOrderReference={workOrder.reference}
        />
      </UserContext.Provider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
