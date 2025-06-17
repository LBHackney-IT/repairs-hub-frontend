import Meta from '@/components/Meta'
import CancelWorkOrderView from '@/components/WorkOrder/CancelWorkOrder/CancelWorkOrderView'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACT_MANAGER_ROLE,
} from '@/auth/user'

const WorkOrderCancelPage = ({ query }) => {
  return (
    <>
      <Meta title={`Cancel Work Order ${query.id}`} />
      <CancelWorkOrderView workOrderReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

WorkOrderCancelPage.permittedRoles = [
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACT_MANAGER_ROLE,
]

export default WorkOrderCancelPage
