import { AUTHORISATION_MANAGER_ROLE } from '../../../utils/user'
import AuthorisationView from '../../../components/WorkOrder/Authorisation/AuthorisationView'
import Meta from '../../../components/Meta'

const AuthorisationPage = ({ query }) => {
  return (
    <>
      <Meta title={`Authorisation for Work Order ${query.id}`} />
      <AuthorisationView workOrderReference={query.id} />
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

AuthorisationPage.permittedRoles = [AUTHORISATION_MANAGER_ROLE]

export default AuthorisationPage
