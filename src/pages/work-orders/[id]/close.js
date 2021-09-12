import Meta from '../../../components/Meta'
import CloseWorkOrderByProxy from '../../../components/WorkOrders/CloseWorkOrderByProxy'
import { CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE } from '../../../utils/user'

const WorkOrderClosePage = ({ query }) => {
  return (
    <>
      <Meta title={`Close Work Order ${query.id}`} />
      <CloseWorkOrderByProxy reference={query.id} />
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
