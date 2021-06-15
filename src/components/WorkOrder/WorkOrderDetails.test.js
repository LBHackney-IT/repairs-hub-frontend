import { render } from '@testing-library/react'
import UserContext from '../UserContext/UserContext'
import WorkOrderDetails from './WorkOrderDetails'
import MultiButton from '../Layout/MultiButton/MultiButton'
import { agent } from 'factories/agent'
import { contractor } from 'factories/contractor'
import { contractManager } from 'factories/contract_manager'
import { authorisationManager } from 'factories/authorisation_manager'
import { URGENT_PRIORITY_CODE } from '../../utils/helpers/priorities'

describe('WorkOrderDetails component', () => {
  const props = {
    workOrder: {
      reference: 10000012,
      dateRaised: '2021-01-18T15:28:57.17811',
      lastUpdated: null,
      priority: 'U - Urgent (5 Working days)',
      property: '',
      owner: 'Alphatrack (S) Systems Lt',
      description: 'This is an urgent repair description',
      propertyReference: '00014888',
      status: 'In Progress',
      priorityCode: URGENT_PRIORITY_CODE,
      raisedBy: 'Dummy Agent',
      target: '2021-01-23T18:30:00.00000',
      callerName: 'Jill Smith',
      callerNumber: '07700 900999',
      operatives: [],
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
    it('should render properly with a link to cancel work order', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: agent }}>
          <MultiButton
            name="workOrderMenu"
            label="Select work order"
            secondary={false}
            choices={[
              {
                href: 'cancel',
                title: 'Cancel',
                description: 'Cancel Work Order',
                permittedRoles: 'agent',
                permittedStatuses: 'In Progress',
              },
            ]}
            workOrderReference={props.workOrder.reference}
          />
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
    it('should render properly with a link to update work order', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: contractor }}>
          <MultiButton
            name="workOrderMenu"
            label="Select work order"
            secondary={false}
            choices={[
              {
                href: 'update',
                title: 'Update',
                description: 'Update Work Order',
                permittedRoles: 'contractor',
                permittedStatuses: 'In Progress',
              },
            ]}
            workOrderReference={props.workOrder.reference}
          />
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
    it('should render properly with a link to cancel work order', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: contractManager }}>
          <MultiButton
            name="workOrderMenu"
            label="Select work order"
            secondary={false}
            choices={[
              {
                href: 'cancel',
                title: 'Cancel',
                description: 'Cancel Work Order',
                permittedRoles: 'contract_manager',
                permittedStatuses: 'In Progress',
              },
            ]}
            workOrderReference={props.workOrder.reference}
          />
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
        <UserContext.Provider value={{ user: contractManager }}>
          <MultiButton
            name="workOrderMenu"
            label="Select work order"
            secondary={false}
            choices={[
              {
                href: 'variation-authorisation',
                title: 'Variation Authorisation',
                description: 'Authorise Work Order Variation',
                permittedRoles: 'contract_manager',
                permittedStatuses: 'Variation Pending Approval',
              },
            ]}
            workOrderReference={props.workOrder.reference}
          />
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
        <UserContext.Provider value={{ user: contractManager }}>
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
    it('should render properly with a link to cancel work order', () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: authorisationManager }}>
          <MultiButton
            name="workOrderMenu"
            label="Select work order"
            secondary={false}
            choices={[
              {
                href: 'cancel',
                title: 'Cancel',
                description: 'Cancel Work Order',
                permittedRoles: 'authorisation_manager',
                permittedStatuses: 'In Progress',
              },
            ]}
            workOrderReference={props.workOrder.reference}
          />
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
        <UserContext.Provider value={{ user: authorisationManager }}>
          <MultiButton
            name="workOrderMenu"
            label="Select work order"
            secondary={false}
            choices={[
              {
                href: 'authorisation',
                title: 'Authorisation',
                description: 'Authorise Work Order',
                permittedRoles: 'authorisation_manager',
                permittedStatuses: 'Authorisation Pending Approval',
              },
            ]}
            workOrderReference={props.workOrder.reference}
          />
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
        <UserContext.Provider value={{ user: authorisationManager }}>
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
