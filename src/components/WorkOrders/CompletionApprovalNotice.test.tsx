import { render, screen } from '@testing-library/react'
import CompletionApprovalNotice from './CompletionApprovalNotice'

describe('CompletionApprovalNotice', () => {
  it('shows the notice when approval is required and the work order is being completed', () => {
    render(
      <CompletionApprovalNotice
        requiresApprovalToComplete={true}
        reason="Work Order Completed"
      />
    )

    expect(screen.getByTestId('completion-approval-notice')).toBeVisible()
    expect(
      screen.getByText('This job needs approval before it is completed')
    ).toBeInTheDocument()
  })

  it('does not show the notice when approval is not required', () => {
    render(
      <CompletionApprovalNotice
        requiresApprovalToComplete={false}
        reason="Work Order Completed"
      />
    )

    expect(
      screen.queryByTestId('completion-approval-notice')
    ).not.toBeInTheDocument()
  })

  it('does not show the notice when the work order is closed for another reason', () => {
    render(
      <CompletionApprovalNotice
        requiresApprovalToComplete={true}
        reason="No Access"
      />
    )

    expect(
      screen.queryByTestId('completion-approval-notice')
    ).not.toBeInTheDocument()
  })

  it('does not show the notice when there is no reason yet', () => {
    render(<CompletionApprovalNotice requiresApprovalToComplete={true} />)

    expect(
      screen.queryByTestId('completion-approval-notice')
    ).not.toBeInTheDocument()
  })
})
