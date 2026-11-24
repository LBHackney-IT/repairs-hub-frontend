import { useState } from 'react'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import BackButton from '../../Layout/BackButton'
import SuccessPage from '../../SuccessPage/index'
import WarningInfoBox from '../../Template/WarningInfoBox'
import PageAnnouncement from '../../Template/PageAnnouncement'
import ApproveCompletionForm from './ApproveCompletionForm'
import { completionApprovedLinks } from '@/utils/successPageLinks'
import { STATUS_COMPLETION_PENDING_APPROVAL } from '@/utils/statusCodes'
import { useWorkOrderDetails } from '@/requests/hooks/useWorkOrderDetails'

interface Props {
  workOrderReference: string
}

const ApproveCompletionView = ({ workOrderReference }: Props) => {
  const { workOrder, isLoading, error } = useWorkOrderDetails(
    workOrderReference
  )
  const [approved, setApproved] = useState(false)

  const isPendingApproval =
    workOrder?.status === STATUS_COMPLETION_PENDING_APPROVAL.description

  if (approved) {
    return (
      <SuccessPage
        banner={
          <PageAnnouncement
            title="Work order completion approved"
            workOrderReference={workOrderReference}
          />
        }
        links={completionApprovedLinks(workOrderReference)}
      />
    )
  }

  return (
    <div>
      <BackButton />
      <h1 className="lbh-heading-h1 govuk-!-margin-right-6">
        Approve completion: {workOrderReference}{' '}
      </h1>

      {isLoading && <Spinner />}

      {error && <ErrorMessage label={error} />}

      {workOrder && !isPendingApproval && (
        <WarningInfoBox
          header="Nothing to approve"
          text="This work order is not waiting for completion approval."
        />
      )}

      {isPendingApproval && (
        <ApproveCompletionForm
          workOrderReference={workOrderReference}
          onApproved={() => setApproved(true)}
        />
      )}
    </div>
  )
}

export default ApproveCompletionView
