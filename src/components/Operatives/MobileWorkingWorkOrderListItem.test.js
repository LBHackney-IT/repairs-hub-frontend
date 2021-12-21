import { render } from '@testing-library/react'
import { WorkOrder } from '../../models/workOrder'
import MobileWorkingWorkOrderListItem from './MobileWorkingWorkOrderListItem'

describe('MobileWorkingWorkOrderListItem component', () => {
  const props = {
    workOrder: {
      reference: 10000621,
      dateRaised: '2021-06-11T13:49:15.878796Z',
      lastUpdated: null,
      priority: '5 [N] NORMAL',
      property: '17 Pitcairn House  St Thomass Square',
      propertyPostCode: 'L53 GS',
      owner: 'Herts Heritage Ltd',
      description: 'Lorem ipsum dolor sit amet, consectetur efficitur.',
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
  }

  it('should render MobileWorkingWorkOrderListItem', () => {
    const { asFragment } = render(
      <MobileWorkingWorkOrderListItem
        workOrder={new WorkOrder(props.workOrder)}
        currentUser={{ operativePayrollNumber: 1 }}
        index={0}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
