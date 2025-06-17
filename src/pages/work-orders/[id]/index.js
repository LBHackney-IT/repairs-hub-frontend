import Meta from '@/components/Meta'
import WorkOrderView from '@/components/WorkOrder/WorkOrderView'
import { getQueryProps } from '@/utils/helpers/serverSideProps'

import { ALL_ROLES } from '@/root/src/utils/auth/user'

const WorkOrderPage = ({ query }) => {
  return (
    <>
      <Meta title={`Work Order ${query.id}`} />
      <WorkOrderView workOrderReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

WorkOrderPage.permittedRoles = [...ALL_ROLES]

export default WorkOrderPage
