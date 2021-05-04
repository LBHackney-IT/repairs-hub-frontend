import CloseWorkOrder from '../../../components/WorkOrders/CloseWorkOrder'
import { CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE } from '../../../utils/user'

const WorkOrderClosePage = ({ query }) => {
  return <CloseWorkOrder reference={query.id} />
}
export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

WorkOrderClosePage.permittedRoles = [CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE]

export default WorkOrderClosePage
