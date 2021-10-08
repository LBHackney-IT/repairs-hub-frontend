import Meta from '../../../components/Meta'
import WorkOrderUpdateView from '../../../components/WorkOrder/Update'
import { CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE } from '../../../utils/user'

const WorkOrderUpdatePage = ({ query }) => {
  return (
    <>
      <Meta title={`Update Work Order ${query.id}`} />
      <WorkOrderUpdateView reference={query.id} />
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
