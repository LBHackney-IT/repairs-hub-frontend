import WarningInfoBox from '../Template/WarningInfoBox'

interface Props {
  requiresApprovalToComplete: boolean
  reason?: string
}

const CompletionApprovalNotice = ({
  requiresApprovalToComplete,
  reason,
}: Props) => {
  // Only completed visits need approval, not other reasons such as No Access
  if (!requiresApprovalToComplete || reason !== 'Work Order Completed') {
    return null
  }

  return (
    <WarningInfoBox
      name="completion-approval-notice"
      className="govuk-!-margin-bottom-6"
      header="This job needs approval before it is completed"
      text="When you complete this job it will be set to Completion Pending Approval. Once the completion is approved, it will be updated in bonus calc."
    />
  )
}

export default CompletionApprovalNotice
