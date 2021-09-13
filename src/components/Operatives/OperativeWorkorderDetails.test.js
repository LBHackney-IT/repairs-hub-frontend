import { render } from '@testing-library/react'
import OperativeWorkOrderDetails from './OperativeWorkOrderDetails'
import { WorkOrder } from '../../models/workOrder'

describe('OperativeWorkOrderDetails component', () => {
  let workOrderData = {
    reference: 10000621,
    dateRaised: '2021-06-11T13:49:15.878796Z',
    lastUpdated: null,
    priority: '5 [N] Normal',
    property: '17 Pitcairn House  St Thomass Square',
    owner: 'Herts Heritage Ltd',
    description: 'r',
    callerName: 'Test Testerson',
    callerNumber: '07856432',
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
    },
  }

  describe('when on operative-index-page', () => {
    it('should render properly work order', () => {
      const { asFragment } = render(
        <OperativeWorkOrderDetails
          property={props.property}
          workOrder={new WorkOrder(workOrderData)}
          personAlerts={props.alerts.personAlert}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
