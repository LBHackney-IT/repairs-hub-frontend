import { render } from '@testing-library/react'
import NotesTimeline from './NotesTimeline'

describe('NotesTimeline component', () => {
  const props = {
    notes: [
      {
        note: 'A more recent note about this repair',
        time: new Date('2021-02-08T15:06:40.057277'),
        user: 'Random Name',
        userEmail: 'random.name@hackney.gov.uk',
      },
      {
        note: 'A note about the repair',
        time: new Date('2021-02-08T15:05:12.743258'),
        user: 'Random Name',
        userEmail: 'random.name@hackney.gov.uk',
      },
    ],
  }

  it('should render properly when there are notes', () => {
    const { asFragment } = render(<NotesTimeline notes={props.notes} />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render properly when there are no notes', () => {
    const { asFragment } = render(<NotesTimeline notes={[]} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
