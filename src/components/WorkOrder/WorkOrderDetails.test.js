import { render } from '@testing-library/react'
import MockDate from 'mockdate'
import UserContext from '../UserContext/UserContext'
import WorkOrderDetails from './WorkOrderDetails'

describe('WorkOrderDetails component', () => {
  const props = {
    workOrder: {
      reference: 10000012,
      dateRaised: '2021-01-18T15:28:57.17811',
      lastUpdated: null,
      priority: 'U - Urgent (5 Working days)',
      property: '',
      owner: '',
      description: 'This is an urgent repair description',
      propertyReference: '00014888',
      status: 'In Progress',
      priorityCode: 2,
      raisedBy: 'Dummy Agent',
      target: '2021-01-23T18:30:00.00000',
      callerName: 'Jill Smith',
      callerNumber: '07700 900999',
    },
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
  }

  describe('when logged in as an agent', () => {
    const user = {
      name: 'An Agent',
      email: 'an.agent@hackney.gov.uk',
      hasRole: true,
      hasAgentPermissions: true,
      hasContractorPermissions: false,
      hasAnyPermissions: true,
    }

    it('should render properly without a link to cancel work order', () => {
      // Link isn't shown if current time is greater than dateRaised + 1 hour
      const { asFragment } = render(
        <UserContext.Provider value={{ user }}>
          <WorkOrderDetails
            propertyReference={props.property.propertyReference}
            workOrder={props.workOrder}
            address={props.property.address}
            subTypeDescription={props.property.hierarchyType.subTypeDescription}
            tenure={props.tenure}
            locationAlerts={props.alerts.locationAlert}
            personAlerts={props.alerts.personAlert}
            hasLinkToProperty={true}
            canRaiseRepair={props.property.canRaiseRepair}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })

    it('should render properly with link to cancel work order', () => {
      // 2021-01-14T18:16:20.986Z
      MockDate.set(1610648180986)
      // Set current time to within an hour of date raised
      props.workOrder.dateRaised = '2021-01-14T18:56:20.986Z'

      const { asFragment } = render(
        <UserContext.Provider value={{ user }}>
          <WorkOrderDetails
            propertyReference={props.property.propertyReference}
            workOrder={props.workOrder}
            address={props.property.address}
            subTypeDescription={props.property.hierarchyType.subTypeDescription}
            tenure={props.tenure}
            locationAlerts={props.alerts.locationAlert}
            personAlerts={props.alerts.personAlert}
            hasLinkToProperty={true}
            canRaiseRepair={props.property.canRaiseRepair}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when logged in as a contractor', () => {
    const user = {
      name: 'A Contractor',
      email: 'a.contractor@hackney.gov.uk',
      hasRole: true,
      hasAgentPermissions: false,
      hasContractorPermissions: true,
      hasAnyPermissions: true,
    }

    it('should render properly without a link to cancel work order', () => {
      // Link isn't shown if current time is greater than dateRaised + 1 hour
      const { asFragment } = render(
        <UserContext.Provider value={{ user }}>
          <WorkOrderDetails
            propertyReference={props.property.propertyReference}
            workOrder={props.workOrder}
            address={props.property.address}
            subTypeDescription={props.property.hierarchyType.subTypeDescription}
            tenure={props.tenure}
            locationAlerts={props.alerts.locationAlert}
            personAlerts={props.alerts.personAlert}
            hasLinkToProperty={true}
            canRaiseRepair={props.property.canRaiseRepair}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })

    it('should render properly without a link to cancel work order', () => {
      // 2021-01-14T18:16:20.986Z
      MockDate.set(1610648180986)
      // Set current time to within an hour of date raised
      props.workOrder.dateRaised = '2021-01-14T18:56:20.986Z'

      const { asFragment } = render(
        <UserContext.Provider value={{ user }}>
          <WorkOrderDetails
            propertyReference={props.property.propertyReference}
            workOrder={props.workOrder}
            address={props.property.address}
            subTypeDescription={props.property.hierarchyType.subTypeDescription}
            tenure={props.tenure}
            locationAlerts={props.alerts.locationAlert}
            personAlerts={props.alerts.personAlert}
            hasLinkToProperty={true}
            canRaiseRepair={props.property.canRaiseRepair}
          />
        </UserContext.Provider>
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
