import CloseJob from '../../../../components/WorkOrders/CloseJob'
import { CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE } from '../../../../utils/user'

const CloseJobPage = ({ query }) => {
  return <CloseJob reference={query.id} />
}
export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

CloseJobPage.permittedRoles = [CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE]

export default CloseJobPage
