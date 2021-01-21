import { render } from '@testing-library/react'
import JobsTable from './JobsTable'

describe('JobsTable component', () => {
  const props = [
    {
      reference: '00012345',
      dateRaised: new Date('2021-01-12T16:24:26.632Z'),
      lastUpdated: new Date('2021-01-13T16:24:26.632Z'),
      priority: 'E - Emergency (24 hours)',
      property: '1 Pitcairn House St Thomass Square',
      owner: '',
      description:
        'ALPHA- Pitcairn house op stucl behind carpark gates from power network pls remedy AND Communal: Door entry; Residents locked out/in',
    },
  ]

  it('should render properly', () => {
    const { asFragment } = render(<JobsTable workOrders={props} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
