import Meta from '../../../components/Meta'
import CancelWorkOrderView from '../../../components/WorkOrder/CancelWorkOrder/CancelWorkOrderView'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACT_MANAGER_ROLE,
} from '../../../utils/user'

const WorkOrderCancelPage = ({ query }) => {
  return (
    <>
      <Meta title={`Cancel Works Order ${query.id}`} />
      <CancelWorkOrderView workOrderReference={query.id} />
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

WorkOrderCancelPage.permittedRoles = [
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACT_MANAGER_ROLE,
]

export default WorkOrderCancelPage
