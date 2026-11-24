import { useEffect, useState } from 'react'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import BackButton from '../../Layout/BackButton'
import SuccessPage from '../../SuccessPage/index'
import WarningInfoBox from '../../Template/WarningInfoBox'
import PageAnnouncement from '../../Template/PageAnnouncement'
import ApproveCompletionForm from './ApproveCompletionForm'
import { completionApprovedLinks } from '@/utils/successPageLinks'
import { STATUS_COMPLETION_PENDING_APPROVAL } from '@/utils/statusCodes'
import { getWorkOrderDetailsRequest } from '@/utils/requests/workOrders'

interface Props {
  workOrderReference: string
}

const ApproveCompletionView = ({ workOrderReference }: Props) => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [approved, setApproved] = useState(false)
  const [isPendingApproval, setIsPendingApproval] = useState(false)

  useEffect(() => {
    const loadWorkOrder = async () => {
      const workOrderResponse = await getWorkOrderDetailsRequest(workOrderReference)

      if (workOrderResponse.success) {
        setIsPendingApproval(
          workOrderResponse.response.status ===
            STATUS_COMPLETION_PENDING_APPROVAL.description
        )
      } else {
        setError(workOrderResponse.error.message)
      }

      setLoading(false)
    }

    loadWorkOrder()
  }, [workOrderReference])

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

      {loading && <Spinner />}

      {error && <ErrorMessage label={error} />}

      {!loading && !error && !isPendingApproval && (
        <WarningInfoBox
          header="Nothing to approve"
          text="This work order is not waiting for completion approval."
        />
      )}

      {!loading && isPendingApproval && (
        <ApproveCompletionForm
          workOrderReference={workOrderReference}
          onApproved={() => setApproved(true)}
        />
      )}
    </div>
  )
}

export default ApproveCompletionView
