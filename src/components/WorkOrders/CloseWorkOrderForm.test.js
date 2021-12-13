import { render } from '@testing-library/react'
import { agent } from '../../../factories/agent'
import UserContext from '../UserContext'
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
    onSubmit: jest.fn(),
    notes: 'this is a note',
    time: '14:30',
    date: new Date('2021-01-12T16:24:26.632Z'),
    operatives: operatives,
    availableOperatives: operatives,
    reason: 'No Access',
    selectedPercentagesToShowOnEdit: [],
    totalSMVs: 76,
  }

  it('should render properly', () => {
    const { asFragment } = render(
      <UserContext.Provider
        value={{
          user: agent,
        }}
      >
        <CloseWorkOrderForm
          reference={props.reference}
          onSubmit={props.onSubmit}
          notes={props.notes}
          time={props.time}
          date={props.date}
          reason={props.reason}
          operativeAssignmentMandatory={true}
          assignedOperativesToWorkOrder={props.operatives}
          availableOperatives={props.availableOperatives}
          selectedPercentagesToShowOnEdit={
            props.selectedPercentagesToShowOnEdit
          }
          closingByProxy={true}
          totalSMV={props.totalSMVs}
          isOvertime={true}
        />
      </UserContext.Provider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
