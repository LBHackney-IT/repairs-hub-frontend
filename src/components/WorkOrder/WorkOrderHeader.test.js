import {
  render,
  act,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import WorkOrderHeader from './WorkOrderHeader'
import UserContext from '../UserContext'
import { agent } from 'factories/agent'
import { WorkOrder } from '@/models/workOrder'
import { URGENT_PRIORITY_CODE } from '@/utils/helpers/priorities'
import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'

const axios = require('axios')

jest.mock('axios', () => jest.fn())

describe('WorkOrderHeader component', () => {
  axios.mockResolvedValue({
    data: {
      alerts: [],
    },
  })

  const workOrderData = {
    reference: 10000012,
    dateRaised: '2021-01-18T15:28:57.17811',
    lastUpdated: null,
    priority: 'U - Urgent (5 Working days)',
    property: '',
    owner: 'Alphatrack (S) Systems Lt',
    description: 'This is an urgent repair description',
    propertyReference: '00014888',
    status: 'Work Completed',
    priorityCode: URGENT_PRIORITY_CODE,
    raisedBy: 'Dummy Agent',
    target: '2021-01-23T18:30:00.00000',
    callerName: 'Jill Smith',
    callerNumber: '07700 900999',
    closedDated: '2021-01-22T18:15:00.00000',
  }

  const appointmentDetailsData = {
    operatives: [],
  }

  const props = {
    property: {
      propertyReference: '00012345',
      address: {
        shortAddress: '16 Pitcairn House  St Thomass Square',
        postalCode: 'E9 6PT',
        addressLine: '16 Pitcairn House',
        streetSuffix: 'St Thomass Square',
      },
      hierarchyType: {
        subTypeDescription: 'Dwelling',
      },
      canRaiseRepair: true,
    },
    tenure: {
      id: 'tenureId1',
      typeCode: 'SEC',
      typeDescription: 'Secure',
      tenancyAgreementReference: 'tenancyAgreementRef1',
    },
    schedulerSessionId: '123',
  }

  describe('when workOrder status is Work Completed or No Access', () => {
    it('should show complition reason: Completed, date and time', async () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: agent }}>
          <WorkOrderHeader
            propertyReference={props.property.propertyReference}
            workOrder={new WorkOrder(workOrderData)}
            appointmentDetails={
              new WorkOrderAppointmentDetails(appointmentDetailsData)
            }
            address={props.property.address}
            subTypeDescription={props.property.hierarchyType.subTypeDescription}
            tenure={props.tenure}
            canRaiseRepair={props.property.canRaiseRepair}
            schedulerSessionId={props.schedulerSessionId}
          />
        </UserContext.Provider>
      )
      await act(async () => {
        await waitForElementToBeRemoved([screen.getByTestId('spinner-alerts')])
      })

      expect(asFragment()).toMatchSnapshot()
    })

    it('should show complition reason: No Access, date and time', async () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: agent }}>
          <WorkOrderHeader
            propertyReference={props.property.propertyReference}
            workOrder={new WorkOrder({ ...workOrderData, status: 'No Access' })}
            appointmentDetails={
              new WorkOrderAppointmentDetails(appointmentDetailsData)
            }
            address={props.property.address}
            subTypeDescription={props.property.hierarchyType.subTypeDescription}
            tenure={props.tenure}
            canRaiseRepair={props.property.canRaiseRepair}
            schedulerSessionId={props.schedulerSessionId}
          />
        </UserContext.Provider>
      )

      await act(async () => {
        await waitForElementToBeRemoved([screen.getByTestId('spinner-alerts')])
      })
      expect(asFragment()).toMatchSnapshot()
    })

    describe('when has operatives without appointment', () => {
      it('should show Operatives', async () => {
        //WorkOrder status: Work Completed
        const operatives = [
          {
            id: 0,
            payrollNumber: '0',
            name: 'Operative 1',
            trades: ['DE'],
          },
          {
            id: 1,
            payrollNumber: '1',
            name: 'Operative 2',
            trades: ['DE'],
          },
        ]

        const { asFragment } = render(
          <UserContext.Provider value={{ user: agent }}>
            <WorkOrderHeader
              propertyReference={props.property.propertyReference}
              workOrder={new WorkOrder(workOrderData)}
              appointmentDetails={
                new WorkOrderAppointmentDetails({
                  ...appointmentDetailsData,
                  operatives,
                })
              }
              address={props.property.address}
              subTypeDescription={
                props.property.hierarchyType.subTypeDescription
              }
              tenure={props.tenure}
              canRaiseRepair={props.property.canRaiseRepair}
              schedulerSessionId={props.schedulerSessionId}
            />
          </UserContext.Provider>
        )

        await act(async () => {
          await waitForElementToBeRemoved([
            screen.getByTestId('spinner-alerts'),
          ])
        })
        expect(asFragment()).toMatchSnapshot()
      })
    })
  })

  describe('when workOrder is in Progress', () => {
    it('should not show complition reason date and time', async () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: agent }}>
          <WorkOrderHeader
            propertyReference={props.property.propertyReference}
            workOrder={
              new WorkOrder({ ...workOrderData, status: 'In Progress' })
            }
            appointmentDetails={
              new WorkOrderAppointmentDetails(appointmentDetailsData)
            }
            address={props.property.address}
            subTypeDescription={props.property.hierarchyType.subTypeDescription}
            tenure={props.tenure}
            canRaiseRepair={props.property.canRaiseRepair}
            schedulerSessionId={props.schedulerSessionId}
          />
        </UserContext.Provider>
      )

      await act(async () => {
        await waitForElementToBeRemoved([screen.getByTestId('spinner-alerts')])
      })
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when work order contains follow-on details', () => {
    it('shows further work required flag', async () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: agent }}>
          <WorkOrderHeader
            propertyReference={props.property.propertyReference}
            workOrder={
              new WorkOrder({
                ...workOrderData,
                status: 'Completed',
                followOnRequest: {
                  id: 27,
                  requiredFollowOnTrades: ['Carpentry'],
                  isMultipleOperatives: true,
                  followOnTypeDescription: 'sdfsdf',
                  stockItemsRequired: true,
                  nonStockItemsRequired: true,
                  materialNotes: 'sdfsd',
                  additionalNotes: 'sdfsdf',
                },
              })
            }
            appointmentDetails={
              new WorkOrderAppointmentDetails(appointmentDetailsData)
            }
            address={props.property.address}
            subTypeDescription={props.property.hierarchyType.subTypeDescription}
            tenure={props.tenure}
            canRaiseRepair={props.property.canRaiseRepair}
            schedulerSessionId={props.schedulerSessionId}
          />
        </UserContext.Provider>
      )

      await act(async () => {
        await waitForElementToBeRemoved([screen.getByTestId('spinner-alerts')])
      })
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
