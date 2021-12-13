import { render } from '@testing-library/react'
import { WorkOrder } from '@/models/workOrder'
import OperativeWorkOrder from './OperativeWorkOrder'
import MockDate from 'mockdate'

describe('OperativeWorkOrder component with single operative', () => {
  const workOrderData = {
    reference: '10000621',
    dateRaised: '2021-06-11T13:49:15.878796Z',
    lastUpdated: null,
    priority: '5 [N] Normal',
    property: '17 Pitcairn House  St Thomass Square',
    owner: 'Herts Heritage Ltd',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    callerName: 'Test Testerson',
    callerNumber: '07856432',
    propertyReference: '00023405',
    tradeCode: 'PL',
    tradeDescription: 'Plumbing - PL',
    status: 'In Progress',
    plannerComment: 'planner comment',
    operatives: [
      {
        id: 1,
        payrollNumber: 'test001',
        name: 'Test',
        trades: [],
        jobPercentage: 100,
      },
    ],
    totalSMVs: 76,
    appointment: {
      date: '2021-09-03',
      description: 'AM Slot',
      start: '08:00',
      end: '13:00',
      reason: null,
      note: 'School run',
    },
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
      personAlert: [
        {
          type: 'DIS',
          comments: 'Property Under Disrepair',
          startDate: '2011-08-16',
          endDate: null,
        },
      ],
      locationAlerts: [
        {
          type: 'CIT',
          comments: '[Temporary] No Lone Interviews',
          startDate: '2011-08-16',
          endDate: null,
        },
      ],
    },
  }

  beforeEach(() => {
    MockDate.set(new Date('Monday 13 December 2021 12:00'))
  })

  afterEach(() => {
    MockDate.reset()
  })

  describe('when has status In Progress', () => {
    const workOrder = new WorkOrder(workOrderData)

    it('should render work order elements with a close link when unvaried', () => {
      const { asFragment } = render(
        <OperativeWorkOrder
          workOrderReference={workOrder.reference}
          property={props.property}
          workOrder={workOrder}
          personAlerts={props.alerts.personAlert}
          locationAlerts={props.alerts.locationAlerts}
          tasksAndSors={[
            {
              id: 'ade7c53b-8947-414c-b88f-9c5e3d875cbf',
              code: 'DES5R006',
              description: 'Urgent call outs',
              dateAdded: '2021-02-03T09:33:35.757339',
              dateUpdated: '2021-02-05T09:33:35.757339',
              quantity: 2,
              cost: 10,
              status: 'Unknown',
              original: true,
              originalQuantity: 2,
              standardMinuteValue: 15,
            },
          ]}
          currentUserPayrollNumber={1}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })

    it('should render work order elements with a form and variation reason when an SOR is varied', () => {
      const { asFragment } = render(
        <OperativeWorkOrder
          workOrderReference={workOrder.reference}
          property={props.property}
          workOrder={workOrder}
          personAlerts={props.alerts.personAlert}
          locationAlerts={props.alerts.locationAlerts}
          tasksAndSors={[
            {
              id: 'ade7c53b-8947-414c-b88f-9c5e3d875cbf',
              code: 'DES5R006',
              description: 'Urgent call outs',
              dateAdded: '2021-02-03T09:33:35.757339',
              dateUpdated: '2021-02-05T09:33:35.757339',
              quantity: 4, // updated quantity
              cost: 10,
              status: 'Unknown',
              original: true,
              originalQuantity: 2,
              standardMinuteValue: 15,
            },
          ]}
          currentUserPayrollNumber={1}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })

    it('should render work order elements with a form and variation reason when an SOR is added', () => {
      const { asFragment } = render(
        <OperativeWorkOrder
          workOrderReference={workOrder.reference}
          property={props.property}
          workOrder={workOrder}
          personAlerts={props.alerts.personAlert}
          locationAlerts={props.alerts.locationAlerts}
          tasksAndSors={[
            {
              id: 'ade7c53b-8947-414c-b88f-9c5e3d875cbf',
              code: 'DES5R006',
              description: 'Urgent call outs',
              dateAdded: '2021-02-03T09:33:35.757339',
              dateUpdated: '2021-02-05T09:33:35.757339',
              quantity: 1,
              cost: 10,
              status: 'Unknown',
              original: false, // newly added
              originalQuantity: null,
              standardMinuteValue: 15,
            },
            {
              id: 'bde7c53b-8947-414c-b88f-9c5e3d875cbg',
              code: 'DES5R005',
              description: 'Normal call outs',
              dateAdded: '2021-02-03T11:23:35.814437',
              dateUpdated: '2021-02-03T11:23:35.814437',
              quantity: 4,
              cost: 0,
              status: 'Unknown',
              original: true,
              originalQuantity: 4,
              standardMinuteValue: 15,
            },
          ]}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when has status Work Complete and work is overtime', () => {
    beforeAll(() => {
      workOrderData.status = 'Work Complete'
      workOrderData.isOvertime = true
    })

    it('should render work order elements with Status Work Complete', () => {
      const workOrder = new WorkOrder(workOrderData)
      const { asFragment } = render(
        <OperativeWorkOrder
          workOrderReference={workOrder.reference}
          property={props.property}
          workOrder={workOrder}
          personAlerts={props.alerts.personAlert}
          locationAlerts={props.alerts.locationAlerts}
          tasksAndSors={[
            {
              id: 'ade7c53b-8947-414c-b88f-9c5e3d875cbf',
              code: 'DES5R006',
              description: 'Urgent call outs',
              dateAdded: '2021-02-03T09:33:35.757339',
              dateUpdated: '2021-02-05T09:33:35.757339',
              quantity: 2,
              cost: 10,
              status: 'Unknown',
              original: true,
              originalQuantity: 2,
              standardMinuteValue: 15,
            },
          ]}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when has status No Access', () => {
    beforeAll(() => {
      workOrderData.status = 'No Access'
    })

    it('should render work order elements with Status No Access', () => {
      const workOrder = new WorkOrder(workOrderData)
      const { asFragment } = render(
        <OperativeWorkOrder
          workOrderReference={workOrder.reference}
          property={props.property}
          workOrder={workOrder}
          personAlerts={props.alerts.personAlert}
          locationAlerts={props.alerts.locationAlerts}
          tasksAndSors={[
            {
              id: 'ade7c53b-8947-414c-b88f-9c5e3d875cbf',
              code: 'DES5R006',
              description: 'Urgent call outs',
              dateAdded: '2021-02-03T09:33:35.757339',
              dateUpdated: '2021-02-05T09:33:35.757339',
              quantity: 2,
              cost: 10,
              status: 'Unknown',
              original: true,
              originalQuantity: 2,
              standardMinuteValue: 15,
            },
          ]}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when the current time is overtime', () => {
    beforeEach(() => {
      MockDate.set(new Date('Monday 13 December 2021 07:59'))
    })

    it('renders an overtime check box', () => {
      const workOrder = new WorkOrder(workOrderData)
      const { asFragment } = render(
        <OperativeWorkOrder
          workOrderReference={workOrder.reference}
          property={props.property}
          workOrder={workOrder}
          personAlerts={props.alerts.personAlert}
          locationAlerts={props.alerts.locationAlerts}
          tasksAndSors={[
            {
              id: 'ade7c53b-8947-414c-b88f-9c5e3d875cbf',
              code: 'DES5R006',
              description: 'Urgent call outs',
              dateAdded: '2021-02-03T09:33:35.757339',
              dateUpdated: '2021-02-05T09:33:35.757339',
              quantity: 2,
              cost: 10,
              status: 'Unknown',
              original: true,
              originalQuantity: 2,
              standardMinuteValue: 15,
            },
          ]}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})

describe('OperativeWorkOrder component with multiple operatives', () => {
  const workOrderData = {
    reference: '10000621',
    dateRaised: '2021-06-11T13:49:15.878796Z',
    lastUpdated: null,
    priority: '5 [N] Normal',
    property: '17 Pitcairn House  St Thomass Square',
    owner: 'Herts Heritage Ltd',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    callerName: 'Test Testerson',
    callerNumber: '07856432',
    propertyReference: '00023405',
    tradeCode: 'PL',
    tradeDescription: 'Plumbing - PL',
    status: 'In Progress',
    plannerComment: 'planner comment',
    operatives: [
      {
        id: 1,
        payrollNumber: 'test001',
        name: 'Test1',
        trades: [],
        jobPercentage: 50,
      },
      {
        id: 2,
        payrollNumber: 'test002',
        name: 'Test2',
        trades: [],
        jobPercentage: 100,
      },
    ],
    totalSMVs: 76,
    appointment: {
      date: '2021-09-03',
      description: 'AM Slot',
      start: '08:00',
      end: '13:00',
      reason: null,
      note: 'School run',
    },
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
      personAlert: [
        {
          type: 'DIS',
          comments: 'Property Under Disrepair',
          startDate: '2011-08-16',
          endDate: null,
        },
      ],
      locationAlerts: [
        {
          type: 'CIT',
          comments: '[Temporary] No Lone Interviews',
          startDate: '2011-08-16',
          endDate: null,
        },
      ],
    },
  }

  const workOrder = new WorkOrder(workOrderData)

  it('should render work order elements with an Update operative link', () => {
    const { asFragment } = render(
      <OperativeWorkOrder
        workOrderReference={workOrder.reference}
        property={props.property}
        workOrder={workOrder}
        personAlerts={props.alerts.personAlert}
        locationAlerts={props.alerts.locationAlerts}
        tasksAndSors={[
          {
            id: 'ade7c53b-8947-414c-b88f-9c5e3d875cbf',
            code: 'DES5R006',
            description: 'Urgent call outs',
            dateAdded: '2021-02-03T09:33:35.757339',
            dateUpdated: '2021-02-05T09:33:35.757339',
            quantity: 2,
            cost: 10,
            status: 'Unknown',
            original: true,
            originalQuantity: 2,
            standardMinuteValue: 15,
          },
        ]}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
