import ChooseOption from '../../../components/WorkOrders/ChooseOption'
import { CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE } from '../../../utils/user'

const WorkOrderChooseOptionPage = ({ query }) => {
  return <ChooseOption reference={query.id} />
}

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

WorkOrderChooseOptionPage.permittedRoles = [
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
]

export default WorkOrderChooseOptionPage
