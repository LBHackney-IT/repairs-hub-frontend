import { render } from '@testing-library/react'
import UserContext from '../UserContext'
import WorkOrdersTable from './WorkOrdersTable'
import { contractor } from 'factories/contractor'

describe('WorkOrdersTable component', () => {
  const props = {
    workOrders: [
      {
        reference: 10000012,
        dateRaised: '2021-01-12T16:24:26.632Z',
        lastUpdated: new Date('2021-01-13T16:24:26.632Z'),
        priority: '2 [E] EMERGENCY',
        property: '1 Pitcairn House St Thomass Square',
        owner: '',
        status: 'In Progress',
        tradeDescription: 'Electrical - EL',
        description:
          'ALPHA- Pitcairn house op stucl behind carpark gates from power network pls remedy AND Communal: Door entry; Residents locked out/in',
      },
    ],
    pageNumber: 1,
    handlePageClick: jest.fn(),
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <UserContext.Provider value={{ user: contractor }}>
        <WorkOrdersTable
          workOrders={props.workOrders}
          pageNumber={props.pageNumber}
          handlePageClick={props.handlePageClick}
          pageSize={2}
        />
      </UserContext.Provider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
