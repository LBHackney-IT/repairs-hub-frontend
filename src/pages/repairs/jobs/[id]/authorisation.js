import { CONTRACT_MANAGER_ROLE } from '../../../../utils/user'
import AuthorisationView from '../../../../components/WorkOrder/Authorisation/AuthorisationView'

const AuthorisationPage = ({ query }) => {
  return <AuthorisationView workOrderReference={query.id} />
}
export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

AuthorisationPage.permittedRoles = [CONTRACT_MANAGER_ROLE]

export default AuthorisationPage
