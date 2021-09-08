import Meta from '../../../components/Meta'
import OperativeWorkOrderView from '../../../components/WorkOrder/OperativeWorkOrderView'
import { OPERATIVE_ROLE, AGENT_ROLE } from '../../../utils/user'
// REMOVE AGENT_ROLE
const OperativeWorkOrderPage = ({ query }) => {
  return (
    <>
      <Meta title={`Work Order ${query.id}`} />
      <OperativeWorkOrderView workOrderReference={query.id} />
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
// REMOVE AGENT_ROLE PERMISSION
OperativeWorkOrderPage.permittedRoles = [OPERATIVE_ROLE, AGENT_ROLE]

export default OperativeWorkOrderPage
