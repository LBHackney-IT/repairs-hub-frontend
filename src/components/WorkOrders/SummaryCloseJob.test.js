import { render } from '@testing-library/react'
import SummaryCloseJob from './SummaryCloseJob'

describe('SummaryCloseJob component', () => {
  const props = {
    reference: '10000012',
    notes: 'this is a note',
    time: '14:30',
    date: '2021-02-03T11:33:35.757339',
    onJobSubmit: jest.fn(),
    changeStep: jest.fn(),
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <SummaryCloseJob
        reference={props.reference}
        notes={props.notes}
        time={props.time}
        date={props.date}
        onJobSubmit={props.onJobSubmit}
        changeStep={props.changeStep}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
