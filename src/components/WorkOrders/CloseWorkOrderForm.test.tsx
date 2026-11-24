import { render } from '@testing-library/react'
import { agent } from '../../../factories/agent'
import UserContext from '../UserContext'
import CloseWorkOrderForm from './CloseWorkOrderForm'
import { Operative } from '../../models/operativeModel'

const DATE_RAISED = '2021-01-01T10:00:00.000Z'

const operativeDefaults: Operative = {
  id: 0,
  name: '',
  jobPercentage: 0,
  payrollNumber: '',
  trades: [],
  isOnejobatatime: false,
}

describe('CloseWorkOrderForm component', () => {
  const operatives = [
    { ...operativeDefaults, id: 1, name: 'Operative A' },
    { ...operativeDefaults, id: 2, name: 'Operative B' },
  ]

  const props = {
    reference: '10000012',
    onSubmit: jest.fn(),
    notes: 'this is a note',
    completionTime: '14:30',
    completionDate: '2021-01-12T16:24:26.632Z',
    startTime: '14:30',
    startDate: '2021-01-12T16:24:26.632Z',
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
          dateRaised={DATE_RAISED}
          onSubmit={props.onSubmit}
          notes={props.notes}
          completionTime={props.completionTime}
          completionDate={props.completionDate}
          startTime={props.startTime}
          startDate={props.startDate}
          reason={props.reason}
          operativeAssignmentMandatory={true}
          assignedOperativesToWorkOrder={props.operatives}
          availableOperatives={props.availableOperatives}
          selectedPercentagesToShowOnEdit={
            props.selectedPercentagesToShowOnEdit
          }
          totalSMV={props.totalSMVs}
          jobIsSplitByOperative={false}
          paymentType={'Overtime'}
          existingStartTime={false}
        />
      </UserContext.Provider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should not render startDate or startTime', () => {
    const { asFragment } = render(
      <UserContext.Provider
        value={{
          user: agent,
        }}
      >
        <CloseWorkOrderForm
          reference={props.reference}
          dateRaised={DATE_RAISED}
          onSubmit={props.onSubmit}
          notes={props.notes}
          completionTime={props.completionTime}
          completionDate={props.completionDate}
          startTime={props.startTime}
          startDate={props.startDate}
          reason={props.reason}
          operativeAssignmentMandatory={true}
          assignedOperativesToWorkOrder={props.operatives}
          availableOperatives={props.availableOperatives}
          selectedPercentagesToShowOnEdit={
            props.selectedPercentagesToShowOnEdit
          }
          totalSMV={props.totalSMVs}
          jobIsSplitByOperative={false}
          paymentType={'Overtime'}
          existingStartTime={true}
        />
      </UserContext.Provider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})

describe('CloseWorkOrderForm component - when follow-on functionality is enabled', () => {
  const operatives = [
    { ...operativeDefaults, id: 1, name: 'Operative A' },
    { ...operativeDefaults, id: 2, name: 'Operative B' },
  ]

  const props = {
    reference: '10000012',
    onSubmit: jest.fn(),
    notes: 'this is a note',
    completionTime: '14:30',
    completionDate: '2021-01-12T16:24:26.632Z',
    startTime: '14:30',
    startDate: '2021-01-12T16:24:26.632Z',
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
          dateRaised={DATE_RAISED}
          onSubmit={props.onSubmit}
          notes={props.notes}
          completionTime={props.completionTime}
          completionDate={props.completionDate}
          startTime={props.startTime}
          startDate={props.startDate}
          reason={props.reason}
          operativeAssignmentMandatory={true}
          assignedOperativesToWorkOrder={props.operatives}
          availableOperatives={props.availableOperatives}
          selectedPercentagesToShowOnEdit={
            props.selectedPercentagesToShowOnEdit
          }
          totalSMV={props.totalSMVs}
          jobIsSplitByOperative={false}
          paymentType={'Overtime'}
          existingStartTime={false}
        />
      </UserContext.Provider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should not render startDate or startTime', () => {
    const { asFragment } = render(
      <UserContext.Provider
        value={{
          user: agent,
        }}
      >
        <CloseWorkOrderForm
          reference={props.reference}
          dateRaised={DATE_RAISED}
          onSubmit={props.onSubmit}
          notes={props.notes}
          completionTime={props.completionTime}
          completionDate={props.completionDate}
          startTime={props.startTime}
          startDate={props.startDate}
          reason={props.reason}
          operativeAssignmentMandatory={true}
          assignedOperativesToWorkOrder={props.operatives}
          availableOperatives={props.availableOperatives}
          selectedPercentagesToShowOnEdit={
            props.selectedPercentagesToShowOnEdit
          }
          totalSMV={props.totalSMVs}
          jobIsSplitByOperative={false}
          paymentType={'Overtime'}
          existingStartTime={true}
        />
      </UserContext.Provider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
