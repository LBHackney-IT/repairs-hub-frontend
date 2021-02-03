import UpdateJob from '../../../../components/WorkOrders/UpdateJob'
import { AGENT_ROLE, CONTRACTOR_ROLE } from '../../../../utils/user'

const JobPage = ({ query }) => {
  return <UpdateJob reference={query.id} />
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
