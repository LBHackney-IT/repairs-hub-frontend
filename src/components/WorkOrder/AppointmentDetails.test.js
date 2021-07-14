import { render } from '@testing-library/react'
import UserContext from '../UserContext/UserContext'
import { agent } from 'factories/agent'
import { NORMAL_PRIORITY_CODE } from '../../utils/helpers/priorities'
import AppointmentDetails from './AppointmentDetails'
import { WorkOrder } from '../../models/work-order'

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

const schedulerSessionId = 'SCHEDULER_SESSION_ID'

describe('AppointmentDetails component', () => {
  describe('DRS work order', () => {
    let drsWorkOrder = {
      ...workOrderData,
      externalAppointmentManagementUrl:
        'https://scheduler.example.hackney.gov.uk?bookingId=1',
    }

    describe('with no appointment', () => {
      describe('when the work order is lower priority', () => {
        it('does show a link to schedule an appointment with DRS Web Booking Manager', () => {
          let workOrder = new WorkOrder(drsWorkOrder)

          workOrder.isLowerPriority = jest.fn(() => true)

          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={workOrder}
                schedulerSessionId={schedulerSessionId}
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('when the work order is not lower priority', () => {
        it('does not show a link to schedule an appointment with DRS Web Booking Manager', () => {
          let workOrder = new WorkOrder(drsWorkOrder)

          workOrder.isLowerPriority = jest.fn(() => false)

          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={workOrder}
                schedulerSessionId={schedulerSessionId}
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })
    })

    describe('with an appointment', () => {
      const appointment = {
        date: '2021-03-19',
        description: 'PM Slot',
        end: '18:00',
        start: '12:00',
      }

      describe('when the work order is lower priority', () => {
        it('shows a link to reschedule an appointment with DRS Web Booking Manager', () => {
          let workOrder = new WorkOrder({ ...drsWorkOrder, appointment })

          workOrder.isLowerPriority = jest.fn(() => true)

          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={workOrder}
                schedulerSessionId={schedulerSessionId}
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })
    })

    describe('when the work order allows scheduling', () => {
      beforeEach(() => {
        drsWorkOrder = {
          ...drsWorkOrder,
          priorityCode: NORMAL_PRIORITY_CODE,
        }
      })

      it('shows a schedule link', () => {
        let workOrder = new WorkOrder(drsWorkOrder)

        workOrder.statusAllowsScheduling = jest.fn(() => true)

        const { asFragment } = render(
          <UserContext.Provider value={{ user: agent }}>
            <AppointmentDetails
              workOrder={workOrder}
              schedulerSessionId={schedulerSessionId}
            />
          </UserContext.Provider>
        )
        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('when the work order does not allow scheduling', () => {
      beforeEach(() => {
        drsWorkOrder = {
          ...drsWorkOrder,
          priorityCode: NORMAL_PRIORITY_CODE,
        }
      })

      it('does not show a schedule link', () => {
        let workOrder = new WorkOrder(drsWorkOrder)

        workOrder.statusAllowsScheduling = jest.fn(() => false)

        const { asFragment } = render(
          <UserContext.Provider value={{ user: agent }}>
            <AppointmentDetails
              workOrder={workOrder}
              schedulerSessionId={schedulerSessionId}
            />
          </UserContext.Provider>
        )
        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('when the work order is not closed', () => {
      beforeEach(() => {
        drsWorkOrder = {
          ...drsWorkOrder,
          priorityCode: NORMAL_PRIORITY_CODE,
          status: 'In Progress',
        }
      })

      it('shows a schedule link', () => {
        const { asFragment } = render(
          <UserContext.Provider value={{ user: agent }}>
            <AppointmentDetails
              workOrder={new WorkOrder(drsWorkOrder)}
              schedulerSessionId={schedulerSessionId}
            />
          </UserContext.Provider>
        )
        expect(asFragment()).toMatchSnapshot()
      })
    })

    describe('when the work order is in a closed state', () => {
      beforeEach(() => {
        drsWorkOrder = {
          ...drsWorkOrder,
          priorityCode: NORMAL_PRIORITY_CODE,
          status: 'Work Complete',
        }
      })

      it('does not show a schedule link', () => {
        const { asFragment } = render(
          <UserContext.Provider value={{ user: agent }}>
            <AppointmentDetails
              workOrder={new WorkOrder(drsWorkOrder)}
              schedulerSessionId={schedulerSessionId}
            />
          </UserContext.Provider>
        )
        expect(asFragment()).toMatchSnapshot()
      })
    })
  })

  describe('Work order (non DRS)', () => {
    let nonDRSWorkOrder = {
      ...workOrderData,
      externalAppointmentManagementUrl: null,
    }

    describe('with no appointment', () => {
      describe('when the work order is lower priority', () => {
        it('does show a link to schedule an appointment with DRS Web Booking Manager', () => {
          let workOrder = new WorkOrder(nonDRSWorkOrder)

          workOrder.isLowerPriority = jest.fn(() => true)

          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={workOrder}
                schedulerSessionId={schedulerSessionId}
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('when the work order is not lower priority', () => {
        it('does not show a link to schedule an appointment with DRS Web Booking Manager', () => {
          let workOrder = new WorkOrder(nonDRSWorkOrder)

          workOrder.isLowerPriority = jest.fn(() => false)

          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={workOrder}
                schedulerSessionId={schedulerSessionId}
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })
    })
  })
})
