import Meta from '@/components/Meta'
import CloseWorkOrderByProxy from '@/components/WorkOrders/CloseWorkOrderByProxy'
import { CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE } from '@/utils/user'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import type { PageProps } from '@/types/page'

const WorkOrderClosePage = ({ query }: PageProps<{ id: string }>) => {
  return (
    <>
      <Meta title={`Close Work Order ${query.id}`} />

      <CloseWorkOrderByProxy reference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

WorkOrderClosePage.permittedRoles = [CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE]

export default WorkOrderClosePage
