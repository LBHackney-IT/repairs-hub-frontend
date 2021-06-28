import Meta from '../../../components/Meta'
import UpdateWorkOrder from '../../../components/WorkOrders/UpdateWorkOrder'
import { CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE } from '../../../utils/user'

const WorkOrderUpdatePage = ({ query }) => {
  return (
    <>
      <Meta title={`Update Work Order ${query.id}`} />
      <UpdateWorkOrder reference={query.id} />
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

WorkOrderUpdatePage.permittedRoles = [CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE]

export default WorkOrderUpdatePage
