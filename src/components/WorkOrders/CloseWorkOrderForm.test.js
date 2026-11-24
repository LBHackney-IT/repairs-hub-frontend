import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
    completionTime: '14:30',
    completionDate: new Date('2021-01-12T16:24:26.632Z'),
    startTime: '14:30',
    startDate: new Date('2021-01-12T16:24:26.632Z'),
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
    completionTime: '14:30',
    completionDate: new Date('2021-01-12T16:24:26.632Z'),
    startTime: '14:30',
    startDate: new Date('2021-01-12T16:24:26.632Z'),
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

describe('CloseWorkOrderForm component - completion approval notice', () => {
  const operatives = [{ id: 1, name: 'Operative A' }]

  const renderForm = ({ requiresApprovalToComplete, reason }) =>
    render(
      <UserContext.Provider value={{ user: agent }}>
        <CloseWorkOrderForm
          reference={10000012}
          onSubmit={jest.fn()}
          notes="this is a note"
          completionTime="14:30"
          completionDate={new Date('2021-01-12T16:24:26.632Z')}
          startTime="14:30"
          startDate={new Date('2021-01-12T16:24:26.632Z')}
          reason={reason}
          operativeAssignmentMandatory={true}
          assignedOperativesToWorkOrder={operatives}
          availableOperatives={operatives}
          selectedPercentagesToShowOnEdit={[]}
          totalSMV={76}
          jobIsSplitByOperative={false}
          paymentType={'Overtime'}
          existingStartTime={false}
          requiresApprovalToComplete={requiresApprovalToComplete}
        />
      </UserContext.Provider>
    )

  it('is shown when the job needs approval and the work order is being completed', () => {
    renderForm({
      requiresApprovalToComplete: true,
      reason: 'Work Order Completed',
    })

    expect(screen.getByTestId('completion-approval-notice')).toBeVisible()
  })

  it('is not shown when the job does not need approval', () => {
    renderForm({
      requiresApprovalToComplete: false,
      reason: 'Work Order Completed',
    })

    expect(
      screen.queryByTestId('completion-approval-notice')
    ).not.toBeInTheDocument()
  })

  it('is not shown when the job is closed with no access', () => {
    renderForm({ requiresApprovalToComplete: true, reason: 'No Access' })

    expect(
      screen.queryByTestId('completion-approval-notice')
    ).not.toBeInTheDocument()
  })

  it('appears and disappears as the reason for closing is changed', async () => {
    renderForm({ requiresApprovalToComplete: true, reason: 'No Access' })

    await userEvent.click(screen.getByLabelText('Visit completed'))

    expect(screen.getByTestId('completion-approval-notice')).toBeVisible()

    await userEvent.click(screen.getByLabelText('No access'))

    expect(
      screen.queryByTestId('completion-approval-notice')
    ).not.toBeInTheDocument()
  })
})
