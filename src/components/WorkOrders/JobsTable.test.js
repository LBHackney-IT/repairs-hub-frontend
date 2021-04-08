import { render } from '@testing-library/react'
import UserContext from '../UserContext/UserContext'
import JobsTable from './JobsTable'

describe('JobsTable component', () => {
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
        description:
          'ALPHA- Pitcairn house op stucl behind carpark gates from power network pls remedy AND Communal: Door entry; Residents locked out/in',
      },
    ],
    pageNumber: 1,
    handlePageClick: jest.fn(),
  }

  it('should render properly', () => {
    const user = {
      name: 'A Contractor',
      email: 'a.contractor@hackney.gov.uk',
      hasRole: true,
      hasAgentPermissions: false,
      hasContractorPermissions: true,
      hasAnyPermissions: true,
    }

    const { asFragment } = render(
      <UserContext.Provider value={{ user }}>
        <JobsTable
          workOrders={props.workOrders}
          pageNumber={props.pageNumber}
          handlePageClick={props.handlePageClick}
        />
      </UserContext.Provider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
