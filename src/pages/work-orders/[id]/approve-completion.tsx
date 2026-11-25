import { COMPLETION_APPROVAL_MANAGER_ROLE, DATA_ADMIN_ROLE } from '@/utils/user'
import ApproveCompletionView from '@/components/WorkOrder/ApproveCompletion/ApproveCompletionView'
import Meta from '@/components/Meta'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import type { PageProps } from '@/types/page'

const ApproveCompletionPage = ({ query }: PageProps<{ id: string }>) => {
  return (
    <>
      <Meta title={`Approve completion of Work Order ${query.id}`} />
      <ApproveCompletionView workOrderReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

ApproveCompletionPage.permittedRoles = [
  COMPLETION_APPROVAL_MANAGER_ROLE,
  DATA_ADMIN_ROLE,
]

export default ApproveCompletionPage
