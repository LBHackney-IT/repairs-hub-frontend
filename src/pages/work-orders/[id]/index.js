import Meta from '@/components/Meta'
import WorkOrderView from '@/components/WorkOrder/WorkOrderView'
import { getQueryProps } from '@/utils/helpers/serverSideProps'

import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from '@/utils/user'

const WorkOrderPage = ({ query }) => {
  return (
    <>
      <Meta title={`Work Order ${query.id}`} />
      <WorkOrderView workOrderReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

WorkOrderPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
]

export default WorkOrderPage
