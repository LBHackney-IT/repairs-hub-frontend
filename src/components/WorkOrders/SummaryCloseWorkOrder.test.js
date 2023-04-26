import { render } from '@testing-library/react'
import SummaryCloseWorkOrder from './SummaryCloseWorkOrder'

describe('SummaryCloseWorkOrder component', () => {
  const props = {
    reference: 10000012,
    notes: 'this is a note',
    completionDate: '2021-02-03T11:33:35.757339',
    startDate: '2021-02-03T11:33:35.757339',
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
        completionDate={props.completionDate}
        startDate={props.startDate}
        reason={props.reason}
        onJobSubmit={props.onJobSubmit}
        changeStep={props.changeStep}
        operativeNames={props.operatives}
        paymentType={'Overtime'}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('does not show rows for operatives and payment type if absent', () => {
    const { asFragment } = render(
      <SummaryCloseWorkOrder
        reference={props.reference}
        notes={props.notes}
        completionDate={props.completionDate}
        startDate={props.startDate}
        reason={props.reason}
        onJobSubmit={props.onJobSubmit}
        changeStep={props.changeStep}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
