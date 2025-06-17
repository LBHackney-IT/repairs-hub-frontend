import Meta from '@/components/Meta'
import CloseWorkOrderByProxy from '@/components/WorkOrders/CloseWorkOrderByProxy'
import { CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE } from '@/auth/user'
import { getQueryProps } from '@/utils/helpers/serverSideProps'

const WorkOrderClosePage = ({ query }) => {
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
