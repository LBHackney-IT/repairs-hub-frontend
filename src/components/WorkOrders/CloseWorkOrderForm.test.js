import { render } from '@testing-library/react'
import CloseWorkOrderForm from './CloseWorkOrderForm'

describe('CloseWorkOrderForm component', () => {
  const operatives = [
    {
      id: 1,
      name: 'Operative A',
    },
    {
      id: 2,
      name: 'Operative B',
    },
  ]

  const props = {
    reference: 10000012,
    onGetToSummary: jest.fn(),
    notes: 'this is a note',
    time: '14:30',
    date: new Date('2021-01-12T16:24:26.632Z'),
    operatives: operatives,
    availableOperatives: operatives,
    reason: 'No Access',
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <CloseWorkOrderForm
        reference={props.reference}
        onGetToSummary={props.onGetToSummary}
        notes={props.notes}
        time={props.time}
        date={props.date}
        reason={props.reason}
        operativeAssignmentMandatory={true}
        currentOperatives={props.operatives}
        availableOperatives={props.availableOperatives}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render an invalid date error with a raised date after completed date', () => {
    const { asFragment } = render(
      <CloseWorkOrderForm
        reference={props.reference}
        onGetToSummary={props.onGetToSummary}
        notes={props.notes}
        time={props.time}
        date={props.date}
        reason={props.reason}
        operativeAssignmentMandatory={true}
        currentOperatives={props.operatives}
        availableOperatives={props.availableOperatives}
        dateRaised={new Date('2025-09-01T12:11:32.121Z')}
      />
    )
    expect(asFragment()).toMatchSnapshot()
  })

})
