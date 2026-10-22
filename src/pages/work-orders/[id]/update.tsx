import Meta from '@/components/Meta'
import WorkOrderUpdateView from '@/components/WorkOrder/Update'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import { CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE } from '@/utils/user'
import type { PageProps } from '@/types/page'

const WorkOrderUpdatePage = ({ query }: PageProps<{ id: string }>) => {
  return (
    <>
      <Meta title={`Update Work Order ${query.id}`} />
      <WorkOrderUpdateView reference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

WorkOrderUpdatePage.permittedRoles = [CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE]

export default WorkOrderUpdatePage
