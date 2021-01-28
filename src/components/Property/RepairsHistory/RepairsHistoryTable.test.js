import { render } from '@testing-library/react'
import RepairsHistoryTable from './RepairsHistoryTable'

describe('RepairsHistoryTable component', () => {
  const props = {
    workOrders: [
      {
        reference: 10000012,
        dateRaised: new Date('2021-01-18T15:28:57.17811'),
        lastUpdated: null,
        priority: 'I - Immediate (2 hours)',
        property: '16 Pitcairn House  St Thomass Square',
        owner: '',
        description: 'This is an immediate repair description',
        propertyReference: '00012345',
        status: 'In progress',
      },
      {
        reference: 10000013,
        dateRaised: new Date('2021-01-23T16:28:57.17811'),
        lastUpdated: null,
        priority: 'U - Urgent (5 Working days)',
        property: '16 Pitcairn House  St Thomass Square',
        owner: '',
        description: 'This is an urgent repair description',
        propertyReference: '00012345',
        status: 'In progress',
      },
    ],
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <RepairsHistoryTable workOrders={props.workOrders} />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
