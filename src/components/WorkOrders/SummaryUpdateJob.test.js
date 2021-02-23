import { render } from '@testing-library/react'
import SummaryUpdateJob from './SummaryUpdateJob'

describe('SummaryUpdateJob component', () => {
  const props = {
    reference: '10000012',
    tasks: [
      {
        code: 'DES5R006',
        quantity: 2,
      },
      {
        code: 'DES5R005',
        quantity: 1,
      },
    ],
    rateScheduleItems: [
      {
        code: 'DES5R004',
        quantity: 2,
      },
    ],
    onJobSubmit: jest.fn(),
    changeStep: jest.fn(),
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <SummaryUpdateJob
        reference={props.reference}
        onJobSubmit={props.onJobSubmit}
        tasks={props.tasks}
        rateScheduleItems={props.rateScheduleItems}
        changeStep={props.changeStep}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
