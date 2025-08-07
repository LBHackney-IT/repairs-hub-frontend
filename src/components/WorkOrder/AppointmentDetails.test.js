jest.mock('./ScheduleAppointment/hooks/useDrsApppointmentScheduler', () => ({
  useDrsAppointmentScheduler: jest.fn(),
}))
import { useDrsAppointmentScheduler } from './ScheduleAppointment/hooks/useDrsApppointmentScheduler'

import { render } from '@testing-library/react'
import UserContext from '../UserContext'
import { agent } from 'factories/agent'
import AppointmentDetails from './AppointmentDetails'
import { WorkOrder } from '@/models/workOrder'
import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'

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
}

const appointmentDetailsData = {
  appointment: null,
}

const schedulerSessionId = 'SCHEDULER_SESSION_ID'

describe('AppointmentDetails component', () => {
  const appointment = {
    date: '2021-03-19',
    description: 'PM Slot',
    end: '18:00',
    start: '12:00',
  }

  beforeEach(() => {
    jest.clearAllMocks()

    useDrsAppointmentScheduler.mockReturnValue({
      schedulerSessionId: schedulerSessionId,
      isLoading: false,
      error: null,
      handleExternalLinkOpen: jest.fn(),
    })
  })

  describe('DRS work order', () => {
    const drsWorkOrder = {
      ...workOrderData,
    }

    describe('with no appointment', () => {
      describe('when the work order can be scheduled', () => {
        it('shows a link to schedule an appointment with DRS Web Booking Manager', () => {
          const workOrder = new WorkOrder(drsWorkOrder)

          workOrder.canBeScheduled = jest.fn(() => true)

          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={workOrder}
                appointmentDetails={
                  new WorkOrderAppointmentDetails({
                    ...appointmentDetailsData,
                    externalAppointmentManagementUrl:
                      'https://scheduler.example.hackney.gov.uk?bookingId=1',
                  })
                }
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('when the work order cannot be scheduled', () => {
        it('does not show a schedule link', () => {
          const workOrder = new WorkOrder(drsWorkOrder)

          workOrder.canBeScheduled = jest.fn(() => false)

          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={workOrder}
                appointmentDetails={
                  new WorkOrderAppointmentDetails({
                    ...appointmentDetailsData,
                    externalAppointmentManagementUrl:
                      'https://scheduler.example.hackney.gov.uk?bookingId=1',
                  })
                }
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })
    })

    describe('with an appointment', () => {
      describe('when the work order can be scheduled', () => {
        it('shows a link to reschedule an appointment with DRS Web Booking Manager', () => {
          const workOrder = new WorkOrder({ ...drsWorkOrder })
          workOrder.canBeScheduled = jest.fn(() => true)

          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={workOrder}
                appointmentDetails={
                  new WorkOrderAppointmentDetails({
                    ...appointmentDetailsData,
                    externalAppointmentManagementUrl:
                      'https://scheduler.example.hackney.gov.uk?bookingId=1',
                    appointment,
                  })
                }
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('when the work order cannot be scheduled', () => {
        it('does not show a reschedule link but shows the existing appointment', () => {
          const workOrder = new WorkOrder({ ...drsWorkOrder })

          workOrder.canBeScheduled = jest.fn(() => false)

          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={workOrder}
                appointmentDetails={
                  new WorkOrderAppointmentDetails({
                    ...appointmentDetailsData,
                    externalAppointmentManagementUrl:
                      'https://scheduler.example.hackney.gov.uk?bookingId=1',
                    appointment,
                  })
                }
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })
    })
  })

  describe('Work order (non DRS)', () => {
    const nonDRSWorkOrder = {
      ...workOrderData,
    }

    describe('with no appointment', () => {
      describe('when the work order can be scheduled', () => {
        it('shows a link to schedule an appointment', () => {
          let workOrder = new WorkOrder(nonDRSWorkOrder)

          workOrder.canBeScheduled = jest.fn(() => true)

          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={workOrder}
                appointmentDetails={
                  new WorkOrderAppointmentDetails({
                    ...appointmentDetailsData,
                    externalAppointmentManagementUrl: null,
                  })
                }
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('when the work order cannot be scheduled', () => {
        it('does not show a schedule link', () => {
          const workOrder = new WorkOrder(nonDRSWorkOrder)
          workOrder.canBeScheduled = jest.fn(() => false)

          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={workOrder}
                appointmentDetails={new WorkOrderAppointmentDetails()}
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })
    })

    describe('with an appointment', () => {
      describe('when the work order can be scheduled', () => {
        it('shows a link to reschedule an appointment', () => {
          const workOrder = new WorkOrder({ ...nonDRSWorkOrder })
          workOrder.canBeScheduled = jest.fn(() => true)

          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={workOrder}
                appointmentDetails={
                  new WorkOrderAppointmentDetails({ appointment })
                }
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('when the work order cannot be scheduled', () => {
        it('does not show a reschedule link but shows the existing appointment', () => {
          const workOrder = new WorkOrder({ ...nonDRSWorkOrder })

          workOrder.canBeScheduled = jest.fn(() => false)

          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={workOrder}
                appointmentDetails={
                  new WorkOrderAppointmentDetails({ appointment })
                }
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })
    })
  })
})
