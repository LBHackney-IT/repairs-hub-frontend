import Meta from '../../../components/Meta'
import UpdateWorkOrderView from '../../../components/WorkOrders/UpdateWorkOrderView'
import { CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE } from '../../../utils/user'

const WorkOrderUpdatePage = ({ query }) => {
  return (
    <>
      <Meta title={`Update Work Order ${query.id}`} />
      <UpdateWorkOrderView reference={query.id} />
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
