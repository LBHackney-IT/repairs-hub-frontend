import { render } from '@testing-library/react'
import SummaryCloseWorkOrder from './SummaryCloseWorkOrder'

describe('SummaryCloseWorkOrder component', () => {
  const props = {
    reference: 10000012,
    notes: 'this is a note',
    time: '14:30',
    date: '2021-02-03T11:33:35.757339',
    reason: 'No Access',
    operatives: ['Operative A', 'Operative B'],
    onJobSubmit: jest.fn(),
    changeStep: jest.fn(),
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <SummaryCloseWorkOrder
        reference={props.reference}
        notes={props.notes}
        time={props.time}
        date={props.date}
        reason={props.reason}
        onJobSubmit={props.onJobSubmit}
        changeStep={props.changeStep}
        operativeNames={props.operatives}
        isOvertime={true}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
