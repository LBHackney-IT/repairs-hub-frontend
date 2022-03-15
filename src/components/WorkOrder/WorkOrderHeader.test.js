import { render } from '@testing-library/react'
import WorkOrderHeader from './WorkOrderHeader'
import UserContext from '../UserContext'
import { agent } from 'factories/agent'
import { WorkOrder } from '@/models/workOrder'
import { URGENT_PRIORITY_CODE } from '@/utils/helpers/priorities'

describe('WorkOrderHeader component', () => {
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
    alerts: {
      locationAlert: [
        {
          type: 'DIS',
          comments: 'Property Under Disrepair',
          startDate: '2011-02-16',
          endDate: null,
        },
      ],
      personAlert: [
        {
          type: 'DIS',
          comments: 'Property Under Disrepair',
          startDate: '2011-08-16',
          endDate: null,
        },
      ],
    },
    tenure: {
      typeCode: 'SEC',
      typeDescription: 'Secure',
    },
    schedulerSessionId: '123',
  }

  describe('when workOrder status is Work Completed or No Access', () => {
    it('should show complition reason: Completed, date and time', () => {
      //WorkOrder status: Work Completed
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
      expect(asFragment()).toMatchSnapshot()
    })
    it('should show complition reason: No Access, date and time', () => {
      //WorkOrder status: No Access
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
      expect(asFragment()).toMatchSnapshot()
    })

    describe('when has operatives without appointment', () => {
      it('should show Operatives', () => {
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
        expect(asFragment()).toMatchSnapshot()
      })
    })
  })

  describe('when workOrder is in Progress', () => {
    it('should not show complition reason date and time', () => {
      //WorkOrder status: In Progress
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
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
