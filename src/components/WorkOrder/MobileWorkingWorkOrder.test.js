import {
  render,
  act,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { WorkOrder } from '@/models/workOrder'
import MobileWorkingWorkOrder from './MobileWorkingWorkOrder'
import MockDate from 'mockdate'
import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'

const axios = require('axios')

jest.mock('axios', () => jest.fn())

describe('MobileWorkingWorkOrder component with single operative', () => {
  axios.mockResolvedValue({
    data: {
      alerts: [],
    },
  })

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
    callerNumber: '07700900000',
    propertyReference: '00023405',
    tradeCode: 'PL',
    tradeDescription: 'Plumbing - PL',
    status: 'In Progress',
    totalSMVs: 76,
  }

  const appointmentDetailsData = {
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

  beforeEach(() => {
    MockDate.set(new Date('Monday 13 December 2021 12:00'))
  })

  afterEach(() => {
    MockDate.reset()
  })

  describe('when has status In Progress', () => {
    const workOrder = new WorkOrder(workOrderData)

    it('should render work order elements when unvaried without a variation textbox', async () => {
      const { asFragment } = render(
        <MobileWorkingWorkOrder
          workOrderReference={workOrder.reference}
          property={props.property}
          workOrder={workOrder}
          appointmentDetails={
            new WorkOrderAppointmentDetails(appointmentDetailsData)
          }
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
          currentUserPayrollNumber={'1'}
          tenure={props.tenure}
          onFormSubmit={jest.fn()}
          photos={[]}
        />
      )

      await act(async () => {
        await waitForElementToBeRemoved([
          screen.getByTestId('spinner-undefined'),
        ])
      })

      expect(asFragment()).toMatchSnapshot()
    })

    it('should render work order elements with a form and variation reason when an SOR is varied', async () => {
      const { asFragment } = render(
        <MobileWorkingWorkOrder
          workOrderReference={workOrder.reference}
          property={props.property}
          workOrder={workOrder}
          appointmentDetails={
            new WorkOrderAppointmentDetails(appointmentDetailsData)
          }
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
          currentUserPayrollNumber={'1'}
          tenure={props.tenure}
          onFormSubmit={jest.fn()}
          photos={[]}
        />
      )

      await act(async () => {
        await waitForElementToBeRemoved([
          screen.getByTestId('spinner-undefined'),
        ])
      })

      expect(asFragment()).toMatchSnapshot()
    })

    it('should render work order elements with a form and variation reason when an SOR is added', async () => {
      const { asFragment } = render(
        <MobileWorkingWorkOrder
          workOrderReference={workOrder.reference}
          property={props.property}
          workOrder={workOrder}
          appointmentDetails={
            new WorkOrderAppointmentDetails(appointmentDetailsData)
          }
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
          currentUserPayrollNumber={'1'}
          tenure={props.tenure}
          onFormSubmit={jest.fn()}
          photos={[]}
        />
      )
      await act(async () => {
        await waitForElementToBeRemoved([
          screen.getByTestId('spinner-undefined'),
        ])
      })

      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when has status Completed and work is overtime', () => {
    beforeAll(() => {
      workOrderData.status = 'Completed'
      workOrderData.paymentType = 'Overtime'
    })

    it('should render work order elements with Status Completed', async () => {
      const workOrder = new WorkOrder(workOrderData)

      const { asFragment } = render(
        <MobileWorkingWorkOrder
          workOrderReference={workOrder.reference}
          property={props.property}
          workOrder={workOrder}
          appointmentDetails={
            new WorkOrderAppointmentDetails(appointmentDetailsData)
          }
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
          currentUserPayrollNumber={'1'}
          tenure={props.tenure}
          onFormSubmit={jest.fn()}
          photos={[]}
        />
      )

      await act(async () => {
        await waitForElementToBeRemoved([
          screen.getByTestId('spinner-undefined'),
        ])
      })
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when has status No Access', () => {
    beforeAll(() => {
      workOrderData.status = 'No Access'
    })

    it('should render work order elements with Status No Access', async () => {
      const workOrder = new WorkOrder(workOrderData)

      const { asFragment } = render(
        <MobileWorkingWorkOrder
          workOrderReference={workOrder.reference}
          property={props.property}
          workOrder={workOrder}
          appointmentDetails={
            new WorkOrderAppointmentDetails(appointmentDetailsData)
          }
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
          currentUserPayrollNumber={'1'}
          tenure={props.tenure}
          onFormSubmit={jest.fn()}
          photos={[]}
        />
      )

      await act(async () => {
        await waitForElementToBeRemoved([
          screen.getByTestId('spinner-undefined'),
        ])
      })
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when the current time is overtime', () => {
    beforeEach(() => {
      MockDate.set(new Date('Monday 13 December 2021 07:59'))
    })

    it('renders an overtime check box', async () => {
      const workOrder = new WorkOrder(workOrderData)

      const { asFragment } = render(
        <MobileWorkingWorkOrder
          workOrderReference={workOrder.reference}
          property={props.property}
          workOrder={workOrder}
          appointmentDetails={
            new WorkOrderAppointmentDetails(appointmentDetailsData)
          }
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
          currentUserPayrollNumber={'1'}
          tenure={props.tenure}
          onFormSubmit={jest.fn()}
          photos={[]}
        />
      )

      await act(async () => {
        await waitForElementToBeRemoved([
          screen.getByTestId('spinner-undefined'),
        ])
      })
      expect(asFragment()).toMatchSnapshot()
    })
  })
})

describe('MobileWorkingWorkOrder component with multiple operatives', () => {
  axios.mockResolvedValue({
    data: {
      alerts: [],
    },
  })

  beforeEach(() => {
    MockDate.set(new Date('Monday 13 December 2021 18:00'))
  })

  afterEach(() => {
    MockDate.reset()
  })

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
    callerNumber: '07700900000',
    propertyReference: '00023405',
    tradeCode: 'PL',
    tradeDescription: 'Plumbing - PL',
    status: 'In Progress',
    totalSMVs: 76,
  }

  const appointmentDetailsData = {
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
        jobPercentage: 50,
      },
    ],

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
  describe('when has status In Progress', () => {
    const workOrder = new WorkOrder(workOrderData)

    it('should render work order elements with an Update operative link', async () => {
      const { asFragment } = render(
        <MobileWorkingWorkOrder
          workOrderReference={workOrder.reference}
          property={props.property}
          workOrder={workOrder}
          appointmentDetails={
            new WorkOrderAppointmentDetails(appointmentDetailsData)
          }
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
          currentUserPayrollNumber={'1'}
          tenure={props.tenure}
          onFormSubmit={jest.fn()}
          photos={[]}
        />
      )

      await act(async () => {
        await waitForElementToBeRemoved([
          screen.getByTestId('spinner-undefined'),
        ])
      })
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when has status Completed', () => {
    beforeAll(() => {
      workOrderData.status = 'Completed'
    })

    it('should render work order elements with Status Completed and operatives list', async () => {
      const workOrder = new WorkOrder(workOrderData)
      const { asFragment } = render(
        <MobileWorkingWorkOrder
          workOrderReference={workOrder.reference}
          property={props.property}
          workOrder={workOrder}
          appointmentDetails={
            new WorkOrderAppointmentDetails(appointmentDetailsData)
          }
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
          currentUserPayrollNumber={'1'}
          tenure={props.tenure}
          onFormSubmit={jest.fn()}
          photos={[]}
        />
      )
      await act(async () => {
        await waitForElementToBeRemoved([
          screen.getByTestId('spinner-undefined'),
        ])
      })
      expect(asFragment()).toMatchSnapshot()
    })
  })
})

describe('MobileWorkingWorkOrder component with startTime', () => {
  axios.mockResolvedValue({
    data: {
      alerts: [],
    },
  })

  beforeEach(() => {
    MockDate.set(new Date('Monday 13 December 2021 18:00'))
  })

  afterEach(() => {
    MockDate.reset()
  })

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
    callerNumber: '07700900000',
    propertyReference: '00023405',
    startTime: '2023-06-11T13:49:15.878796Z',
    tradeCode: 'PL',
    tradeDescription: 'Plumbing - PL',
    status: 'In Progress',
    totalSMVs: 76,
  }

  const appointmentDetailsData = {
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
        jobPercentage: 50,
      },
    ],
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

  describe('when the workOrder has been loaded', () => {
    const workOrder = new WorkOrder(workOrderData)
    it('should render the confirm button', async () => {
      const { asFragment } = render(
        <MobileWorkingWorkOrder
          workOrderReference={workOrder.reference}
          property={props.property}
          workOrder={workOrder}
          appointmentDetails={
            new WorkOrderAppointmentDetails(appointmentDetailsData)
          }
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
          currentUserPayrollNumber={'1'}
          tenure={props.tenure}
          onFormSubmit={jest.fn()}
          photos={[]}
        />
      )

      await act(async () => {
        await waitForElementToBeRemoved([
          screen.getByTestId('spinner-undefined'),
        ])
      })
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
