import { render } from '@testing-library/react'
import UserContext from '../UserContext/UserContext'
import { agent } from 'factories/agent'
import {
  IMMEDIATE_PRIORITY_CODE,
  EMERGENCY_PRIORITY_CODE,
  URGENT_PRIORITY_CODE,
  NORMAL_PRIORITY_CODE,
} from '../../utils/helpers/priorities'
import AppointmentDetails from './AppointmentDetails'
import { STATUS_CANCELLED } from '../../utils/status-codes'

const workOrder = {
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
    workOrder.externalAppointmentManagementUrl =
      'https://scheduler.example.hackney.gov.uk?bookingId=1'

    describe('with no appointment', () => {
      describe('when the work order is immediate priority', () => {
        it('does not show a link to schedule an appointment with DRS Web Booking Manager', () => {
          workOrder.priorityCode = IMMEDIATE_PRIORITY_CODE

          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={{
                  ...workOrder,
                  priorityCode: IMMEDIATE_PRIORITY_CODE,
                }}
                schedulerSessionId={schedulerSessionId}
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('when the work order is emergency priority', () => {
        it('does not show a link to schedule an appointment with DRS Web Booking Manager', () => {
          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={{
                  ...workOrder,
                  priorityCode: EMERGENCY_PRIORITY_CODE,
                }}
                schedulerSessionId={schedulerSessionId}
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('when the work order is urgent priority', () => {
        it('does show a link to schedule an appointment with DRS Web Booking Manager', () => {
          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={{
                  ...workOrder,
                  priorityCode: URGENT_PRIORITY_CODE,
                }}
                schedulerSessionId={schedulerSessionId}
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('when the work order is normal priority', () => {
        it('does show a link to schedule an appointment with DRS Web Booking Manager', () => {
          workOrder.priorityCode = NORMAL_PRIORITY_CODE

          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={{
                  ...workOrder,
                  priorityCode: NORMAL_PRIORITY_CODE,
                }}
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

      describe('when the work order is urgent priority', () => {
        it('does not show a link to schedule an appointment with DRS Web Booking Manager', () => {
          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={{
                  ...workOrder,
                  priorityCode: URGENT_PRIORITY_CODE,
                  appointment,
                }}
                schedulerSessionId={schedulerSessionId}
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('when the work order is normal priority', () => {
        it('does not show a link to schedule an appointment with DRS Web Booking Manager', () => {
          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={{
                  ...workOrder,
                  priorityCode: NORMAL_PRIORITY_CODE,
                  appointment,
                }}
                schedulerSessionId={schedulerSessionId}
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })
    })
  })

  describe('Work order (non DRS)', () => {
    describe('with no appointment', () => {
      describe('when the work order is immediate priority', () => {
        it('does not show a link to schedule an appointment', () => {
          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={{
                  ...workOrder,
                  priorityCode: IMMEDIATE_PRIORITY_CODE,
                  externalAppointmentManagementUrl: null,
                }}
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('when the work order is emergency priority', () => {
        it('does not show a link to schedule an appointment', () => {
          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={{
                  ...workOrder,
                  priorityCode: EMERGENCY_PRIORITY_CODE,
                  externalAppointmentManagementUrl: null,
                }}
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('when the work order is urgent priority', () => {
        it('does show a link to schedule an appointment', () => {
          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={{
                  ...workOrder,
                  priorityCode: URGENT_PRIORITY_CODE,
                  externalAppointmentManagementUrl: null,
                }}
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })

      describe('when the work order is normal priority', () => {
        it('does show a link to schedule an appointment', () => {
          const { asFragment } = render(
            <UserContext.Provider value={{ user: agent }}>
              <AppointmentDetails
                workOrder={{
                  ...workOrder,
                  priorityCode: NORMAL_PRIORITY_CODE,
                  externalAppointmentManagementUrl: null,
                }}
              />
            </UserContext.Provider>
          )
          expect(asFragment()).toMatchSnapshot()
        })
      })
    })
  })

  it('Displays "Not applicable" when the work order has been cancelled', () => {
    const { asFragment } = render(
      <UserContext.Provider value={{ user: agent }}>
        <AppointmentDetails
          workOrder={{
            ...workOrder,
            priorityCode: EMERGENCY_PRIORITY_CODE,
            status: STATUS_CANCELLED.description,
          }}
        />
      </UserContext.Provider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
