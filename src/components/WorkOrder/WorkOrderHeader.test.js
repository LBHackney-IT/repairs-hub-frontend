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

import axios from 'axios'

jest.mock('axios', () => jest.fn())

describe('WorkOrderHeader component', () => {
  axios.mockResolvedValue({
    data: {
      alerts: [],
    },
  })

  let workOrderData = {
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
    operatives: [],
    closedDated: '2021-01-22T18:15:00.00000',
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
            address={props.property.address}
            subTypeDescription={props.property.hierarchyType.subTypeDescription}
            tenure={props.tenure}
            canRaiseRepair={props.property.canRaiseRepair}
            schedulerSessionId={props.schedulerSessionId}
          />
        </UserContext.Provider>
      )
      await act(async () => {
        await waitForElementToBeRemoved([
          screen.getByTestId('spinner-locationAlerts'),
          screen.getByTestId('spinner-personAlerts'),
        ])
      })

      expect(asFragment()).toMatchSnapshot()
    })

    it('should show complition reason: No Access, date and time', async () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: agent }}>
          <WorkOrderHeader
            propertyReference={props.property.propertyReference}
            workOrder={new WorkOrder({ ...workOrderData, status: 'No Access' })}
            address={props.property.address}
            subTypeDescription={props.property.hierarchyType.subTypeDescription}
            tenure={props.tenure}
            canRaiseRepair={props.property.canRaiseRepair}
            schedulerSessionId={props.schedulerSessionId}
          />
        </UserContext.Provider>
      )

      await act(async () => {
        await waitForElementToBeRemoved([
          screen.getByTestId('spinner-locationAlerts'),
          screen.getByTestId('spinner-personAlerts'),
        ])
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
              workOrder={
                new WorkOrder({ ...workOrderData, operatives: operatives })
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
            screen.getByTestId('spinner-locationAlerts'),
            screen.getByTestId('spinner-personAlerts'),
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
            address={props.property.address}
            subTypeDescription={props.property.hierarchyType.subTypeDescription}
            tenure={props.tenure}
            canRaiseRepair={props.property.canRaiseRepair}
            schedulerSessionId={props.schedulerSessionId}
          />
        </UserContext.Provider>
      )

      await act(async () => {
        await waitForElementToBeRemoved([
          screen.getByTestId('spinner-locationAlerts'),
          screen.getByTestId('spinner-personAlerts'),
        ])
      })
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
