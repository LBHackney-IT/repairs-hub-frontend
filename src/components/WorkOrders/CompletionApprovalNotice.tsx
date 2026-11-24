import WarningInfoBox from '../Template/WarningInfoBox'

interface Props {
  // The completion approval step is on and this job needs approval to complete
  requiresApprovalToComplete: boolean
  // Only completed visits need approval, not for example No Access
  isCompleting: boolean
}

const CompletionApprovalNotice = ({
  requiresApprovalToComplete,
  isCompleting,
}: Props) => {
  if (!requiresApprovalToComplete || !isCompleting) {
    return null
  }

  return (
    <WarningInfoBox
      name="completion-approval-notice"
      className="govuk-!-margin-bottom-6"
      header="This job needs approval before it is completed"
      text="When you complete this job it will be set to Completion Pending Approval. Once the completion is approved, it will be updated in bonus calculation."
    />
  )
}

export default CompletionApprovalNotice
