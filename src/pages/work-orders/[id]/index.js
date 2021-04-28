import WorkOrderView from '../../../components/WorkOrder/WorkOrderView'
import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
} from '../../../utils/user'

const WorkOrderPage = ({ query }) => {
  return <WorkOrderView workOrderReference={query.id} />
}

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

WorkOrderPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
]

export default WorkOrderPage
