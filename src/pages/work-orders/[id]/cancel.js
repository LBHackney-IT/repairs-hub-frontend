import CancelWorkOrderView from '../../../components/WorkOrder/CancelWorkOrder/CancelWorkOrderView'
import { AGENT_ROLE, CONTRACTOR_ROLE } from '../../../utils/user'

const CancelWorkOrderPage = ({ query }) => {
  return <CancelWorkOrderView workOrderReference={query.id} />
}

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

CancelWorkOrderPage.permittedRoles = [AGENT_ROLE, CONTRACTOR_ROLE]

export default CancelWorkOrderPage
