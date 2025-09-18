import {
  render,
  act,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import UserContext from '../UserContext'
import WorkOrderDetails from './WorkOrderDetails'
import MultiButton from '../Layout/MultiButton'
import { agent } from 'factories/agent'
import { contractor } from 'factories/contractor'
import { contractManager } from 'factories/contract_manager'
import { authorisationManager } from 'factories/authorisation_manager'
import { URGENT_PRIORITY_CODE } from '@/utils/helpers/priorities'
import { WorkOrder } from '@/models/workOrder'
import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'

const axios = require('axios')

jest.mock('axios', () => jest.fn())

describe('WorkOrderDetails component', () => {
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
    status: 'In Progress',
    priorityCode: URGENT_PRIORITY_CODE,
    raisedBy: 'Dummy Agent',
    target: '2021-01-23T18:30:00.00000',
    callerName: 'Jill Smith',
    callerNumber: '07700 900999',
  }

  const appointmentDetailsData = {
    operatives: [],
  }

  const migratedWorkOrderData = {
    reference: 648707,
    dateRaised: '2014-02-22T07:58:20.37842',
    lastUpdated: null,
    priority: 'U - Urgent (5 Working days)',
    property: '',
    owner: 'Alphatrack (S) Systems Lt',
    description: 'This is a migrated repair description',
    propertyReference: '00014888',
    status: 'In Progress',
    priorityCode: URGENT_PRIORITY_CODE,
    raisedBy: 'Dummy Agent',
    target: '2014-02-27T18:30:00.00000',
    callerName: 'Jill Smith',
    callerNumber: '07700 900999',
    // operatives: [],
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
  }

  describe('when logged in as an agent', () => {
    it('should render properly with a link to cancel work order', async () => {
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
            workOrderReference={workOrderData.reference}
          />
          <WorkOrderDetails
            property={props.property}
            workOrder={new WorkOrder(workOrderData)}
            appointmentDetails={
              new WorkOrderAppointmentDetails(appointmentDetailsData)
            }
            tasksAndSors={[]}
            tenure={props.tenure}
            hasLinkToProperty={true}
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

    it('should render migrated work order references correctly', async () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: agent }}>
          <WorkOrderDetails
            property={props.property}
            workOrder={new WorkOrder(migratedWorkOrderData)}
            appointmentDetails={
              new WorkOrderAppointmentDetails(appointmentDetailsData)
            }
            tasksAndSors={[]}
            tenure={props.tenure}
            hasLinkToProperty={true}
          />
        </UserContext.Provider>
      )

      await act(async () => {
        await waitForElementToBeRemoved([
          screen.getByTestId('spinner-locationAlerts'),
          screen.getByTestId('spinner-personAlerts'),
        ])
      })

      // if work order is 648707 then it should render is as 00648707 (with leading zeroes)
      expect(asFragment()).toMatchSnapshot()
    })
    it('should not render the work order action menu if work order is closed', async () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: agent }}>
          <WorkOrderDetails
            property={props.property}
            workOrder={
              new WorkOrder({
                ...workOrderData,
                closedDated: '2021-01-22T18:15:00.00000',
              })
            }
            appointmentDetails={
              new WorkOrderAppointmentDetails(appointmentDetailsData)
            }
            tasksAndSors={[]}
            tenure={props.tenure}
            hasLinkToProperty={true}
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

  describe('when logged in as a contractor', () => {
    it('should render properly with a link to update work order', async () => {
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
            workOrderReference={workOrderData.reference}
          />
          <WorkOrderDetails
            property={props.property}
            workOrder={new WorkOrder(workOrderData)}
            appointmentDetails={
              new WorkOrderAppointmentDetails(appointmentDetailsData)
            }
            tasksAndSors={[]}
            tenure={props.tenure}
            hasLinkToProperty={true}
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

  describe('when logged in as a contract manager', () => {
    it('should render properly with a link to cancel work order', async () => {
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
            workOrderReference={workOrderData.reference}
          />
          <WorkOrderDetails
            property={props.property}
            workOrder={new WorkOrder(workOrderData)}
            appointmentDetails={
              new WorkOrderAppointmentDetails(appointmentDetailsData)
            }
            tasksAndSors={[]}
            tenure={props.tenure}
            hasLinkToProperty={true}
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

    it('should render with a link to authorise a variation request when status is variation pending approval', async () => {
      // Work order status is Variation Pending Approval
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
            workOrderReference={workOrderData.reference}
          />
          <WorkOrderDetails
            property={props.property}
            workOrder={
              new WorkOrder({
                ...workOrderData,
                status: 'Variation Pending Approval',
              })
            }
            appointmentDetails={
              new WorkOrderAppointmentDetails(appointmentDetailsData)
            }
            tasksAndSors={[]}
            tenure={props.tenure}
            hasLinkToProperty={true}
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

    it('should render without a link to authorise a variation request when status is not variation pending approval', async () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: contractManager }}>
          <WorkOrderDetails
            property={props.property}
            workOrder={
              new WorkOrder({ ...workOrderData, status: 'In Progress' })
            }
            appointmentDetails={
              new WorkOrderAppointmentDetails(appointmentDetailsData)
            }
            tasksAndSors={[]}
            tenure={props.tenure}
            hasLinkToProperty={true}
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

  describe('when logged in as an authorisation manager', () => {
    it('should render properly with a link to cancel work order', async () => {
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
            workOrderReference={workOrderData.reference}
          />
          <WorkOrderDetails
            property={props.property}
            workOrder={new WorkOrder(workOrderData)}
            appointmentDetails={
              new WorkOrderAppointmentDetails(appointmentDetailsData)
            }
            tasksAndSors={[]}
            tenure={props.tenure}
            hasLinkToProperty={true}
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

    it('should render with a link to authorise a new work order when status is authorisation pending approval', async () => {
      // Work order status is Authorisation Pending Approval
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
            workOrderReference={workOrderData.reference}
          />
          <WorkOrderDetails
            property={props.property}
            workOrder={
              new WorkOrder({
                ...workOrderData,
                status: 'Authorisation Pending Approval',
              })
            }
            appointmentDetails={
              new WorkOrderAppointmentDetails(appointmentDetailsData)
            }
            tasksAndSors={[]}
            tenure={props.tenure}
            hasLinkToProperty={true}
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

    it('should render without a link to authorise a new work order when status is not authorisation pending approval', async () => {
      const { asFragment } = render(
        <UserContext.Provider value={{ user: authorisationManager }}>
          <WorkOrderDetails
            property={props.property}
            workOrder={
              new WorkOrder({ ...workOrderData, status: 'In Progress' })
            }
            appointmentDetails={
              new WorkOrderAppointmentDetails(appointmentDetailsData)
            }
            tasksAndSors={[]}
            tenure={props.tenure}
            hasLinkToProperty={true}
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
