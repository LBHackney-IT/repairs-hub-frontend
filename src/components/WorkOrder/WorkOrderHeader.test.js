import { render } from '@testing-library/react'
import WorkOrderHeader from './WorkOrderHeader'
import UserContext from '../UserContext/UserContext'
import { agent } from 'factories/agent'
import { WorkOrder } from '../../models/workOrder'

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
    status: 'Work Complete',
    priorityCode: 'some code',
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
        levelCode: '7',
        subTypeCode: 'DWE',
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

  describe('when workOrder status is Work Complete or No Access', () => {
    it('should show complition reason: Completed, date and time', () => {
      //WorkOrder status: Work Complete
      const { asFragment } = render(
        <UserContext.Provider value={{ user: agent }}>
          <WorkOrderHeader
            propertyReference={props.property.propertyReference}
            workOrder={new WorkOrder(workOrderData)}
            address={props.property.address}
            subTypeDescription={props.property.hierarchyType.subTypeDescription}
            locationAlerts={props.alerts.locationAlert}
            personAlerts={props.alerts.personAlert}
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
            locationAlerts={props.alerts.locationAlert}
            personAlerts={props.alerts.personAlert}
            tenure={props.tenure}
            canRaiseRepair={props.property.canRaiseRepair}
            schedulerSessionId={props.schedulerSessionId}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
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
            locationAlerts={props.alerts.locationAlert}
            personAlerts={props.alerts.personAlert}
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
