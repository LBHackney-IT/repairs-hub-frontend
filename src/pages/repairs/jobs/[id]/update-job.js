import UpdateJob from '../../../../components/WorkOrders/UpdateJob'
import { CONTRACTOR_ROLE } from '../../../../utils/user'

const UpdateJobPage = ({ query }) => {
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

UpdateJobPage.permittedRoles = [CONTRACTOR_ROLE]

export default UpdateJobPage
