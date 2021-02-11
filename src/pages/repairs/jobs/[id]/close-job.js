import CloseJob from '../../../../components/WorkOrders/CloseJob'
import { AGENT_ROLE, CONTRACTOR_ROLE } from '../../../../utils/user'

const JobPage = ({ query }) => {
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

JobPage.permittedRoles = [AGENT_ROLE, CONTRACTOR_ROLE]

export default JobPage
