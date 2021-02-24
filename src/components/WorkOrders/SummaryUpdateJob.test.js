import { render } from '@testing-library/react'
import SummaryUpdateJob from './SummaryUpdateJob'

describe('SummaryUpdateJob component', () => {
  const props = {
    reference: '10000012',
    tasks: [
      {
        code: 'DES5R006',
        quantity: 2,
        cost: '10.5',
      },
      {
        code: 'DES5R005',
        quantity: 1,
        cost: '14.5',
      },
    ],
    addedTasks: [
      {
        code: 'DES5R004',
        quantity: 2,
        cost: '22.5',
      },
    ],
    onJobSubmit: jest.fn(),
    changeStep: jest.fn(),
    calculateTotalCost: jest.fn(),
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <SummaryUpdateJob
        reference={props.reference}
        onJobSubmit={props.onJobSubmit}
        tasks={props.tasks}
        addedTasks={props.addedTasks}
        changeStep={props.changeStep}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
