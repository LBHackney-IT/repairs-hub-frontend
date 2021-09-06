import { render } from '@testing-library/react'
import OperativeWorkOrderListItem from './OperativeWorkOrderListItem'

describe('OperativeWorkOrderListItem component', () => {
  const props = {
    operativeWorkOrders: [
      {
        reference: 10000621,
        dateRaised: '2021-06-11T13:49:15.878796Z',
        lastUpdated: null,
        priority: '5 [N] NORMAL',
        property: '17 Pitcairn House  St Thomass Square',
        owner: 'Herts Heritage Ltd',
        description: 'r',
        propertyReference: '00023405',
        tradeCode: 'PL',
        tradeDescription: 'Plumbing - PL',
        status: 'In Progress',
        appointment: {
          date: '2021-09-03',
          description: 'AM Slot',
          start: '08:00',
          end: '13:00',
          reason: null,
          note: null,
        },
      },
      {
        reference: 10000625,
        dateRaised: '2021-06-11T13:49:15.878796Z',
        lastUpdated: null,
        priority: '2 [E] EMERGENCY',
        property: '17 Pitcairn House  St Thomass Square',
        owner: 'Herts Heritage Ltd',
        description: 'r',
        propertyReference: '00023405',
        tradeCode: 'PL',
        tradeDescription: 'Plumbing - PL',
        status: 'In Progress',
        appointment: {
          date: '2021-09-03',
          description: 'PM Slot',
          start: '12:00',
          end: '18:00',
          reason: null,
          note: null,
        },
      },
    ],
  }

  it('should render operativeWorkOrderListItem', () => {
    const { asFragment } = render(
      <OperativeWorkOrderListItem
        operativeWorkOrders={props.operativeWorkOrders}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
