import { render } from '@testing-library/react'
import NoteEntry from './NoteEntry'

describe('NoteEntry component', () => {
  const props = {
    note: 'Image from user: http://example-url/',
    time: new Date(),
    user: 'Test user',
    userEmail: 'sample@sample.com',
  }

  it('should render properle', () => {
    const { asFragment } = render(
      <NoteEntry
        note={props.note}
        time={props.time}
        user={props.user}
        userEmail={props.userEmail}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
