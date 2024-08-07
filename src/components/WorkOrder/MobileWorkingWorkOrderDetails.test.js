import {
  render,
  act,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import MobileWorkingWorkOrderDetails from './MobileWorkingWorkOrderDetails'
import { WorkOrder } from '@/models/workOrder'

const axios = require('axios')

jest.mock('axios', () => jest.fn())

describe('MobileWorkingWorkOrderDetails component', () => {
  let workOrderData = {
    reference: 10000621,
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
    plannerComment: 'planner comment',
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
      tenancyAgreementReference: 'tenancyAgreementRef1',
      typeCode: 'tenancyTypeCode',
      typeDescription: 'tenancyTypeDescription',
    },
  }

  axios
    .mockResolvedValueOnce({
      data: {
        alerts: [
          {
            type: 'type1',
            comments: 'Location Alert 1',
          },
          {
            type: 'type2',
            comments: 'Location Alert 2',
          },
        ],
      },
    })
    .mockResolvedValueOnce({
      data: {
        alerts: [
          {
            type: 'type3',
            comments: 'Person Alert 1',
          },
          {
            type: 'type4',
            comments: 'Person Alert 2',
          },
        ],
      },
    })

  it('should render properly work order', async () => {
    const { asFragment } = render(
      <MobileWorkingWorkOrderDetails
        property={props.property}
        workOrder={new WorkOrder(workOrderData)}
        tenure={props.tenure}
        photos={[]}
      />
    )
    expect(asFragment()).toMatchSnapshot()

    await act(async () => {
      await waitForElementToBeRemoved([
        screen.getByTestId('spinner-locationAlerts'),
        screen.getByTestId('spinner-personAlerts'),
      ])
    })

    expect(axios).toHaveBeenCalledTimes(2)

    expect(axios).toHaveBeenCalledWith({
      method: 'get',
      url: '/api/properties/00012345/location-alerts',
    })

    expect(axios).toHaveBeenCalledWith({
      method: 'get',
      url: '/api/properties/tenureId1/person-alerts',
    })

    expect(asFragment()).toMatchSnapshot()
  })
})
