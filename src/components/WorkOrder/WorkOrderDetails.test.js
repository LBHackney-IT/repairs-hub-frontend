import { render } from '@testing-library/react'
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
      hasContractManagerPermissions: false,
      hasAnyPermissions: true,
    }

    it('should render properly with a link to cancel work order', () => {
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
      hasContractManagerPermissions: false,
      hasAnyPermissions: true,
    }

    it('should render properly with a link to update work order', () => {
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

  describe('when logged in as a contract manager', () => {
    const user = {
      name: 'A Contract Manager',
      email: 'a.contract-manager@hackney.gov.uk',
      hasRole: true,
      hasAgentPermissions: false,
      hasContractorPermissions: false,
      hasContractManagerPermissions: true,
      hasAnyPermissions: true,
    }

    it('should render properly with a link to cancel work order', () => {
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

    it('should render with a link to authorise a variation request when status is variation pending approval', () => {
      // Work order status is Variation Pending Approval
      props.workOrder.status = 'Variation Pending Approval'
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

    it('should render without a link to authorise a variation request when status is not variation pending approval', () => {
      // Work order status is In Progress
      props.workOrder.status = 'In Progress'
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

  describe('when logged in as an authorisation manager', () => {
    const user = {
      name: 'An authorisation manager',
      email: 'an.authorisation-manager@hackney.gov.uk',
      hasRole: true,
      hasAgentPermissions: false,
      hasContractorPermissions: false,
      hasContractManagerPermissions: false,
      hasAuthorisationManagerPermissions: true,
      hasAnyPermissions: true,
    }

    it('should render properly with a link to cancel work order', () => {
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

    it('should render with a link to authorise a new work order when status is authorisation pending approval', () => {
      // Work order status is Authorisation Pending Approval
      props.workOrder.status = 'Authorisation Pending Approval'
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

    it('should render without a link to authorise a new work order when status is not authorisation pending approval', () => {
      // Work order status is In Progress
      props.workOrder.status = 'In Progress'
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
