import Meta from '../../../components/Meta'
import CloseWorkOrder from '../../../components/WorkOrders/CloseWorkOrder'
import { CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE } from '../../../utils/user'

const WorkOrderClosePage = ({ query }) => {
  return (
    <>
      <Meta title={`Close Work Order ${query.id}`} />
      <CloseWorkOrder reference={query.id} />
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

WorkOrderClosePage.permittedRoles = [CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE]

export default WorkOrderClosePage
