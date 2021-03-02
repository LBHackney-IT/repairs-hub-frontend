import { render } from '@testing-library/react'
import CloseJobForm from './CloseJobForm'

describe('CloseJobForm component', () => {
  const props = {
    reference: '10000012',
    onGetToSummary: jest.fn(),
    notes: 'this is a note',
    time: '14:30',
    date: new Date('2021-01-12T16:24:26.632Z'),
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <CloseJobForm
        reference={props.reference}
        onGetToSummary={props.onGetToSummary}
        notes={props.notes}
        time={props.time}
        date={props.date}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
