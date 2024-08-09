import { AUTHORISATION_MANAGER_ROLE } from '@/utils/user'
import AuthorisationView from '@/components/WorkOrder/Authorisation/AuthorisationView'
import Meta from '@/components/Meta'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import PropTypes from 'prop-types'

const AuthorisationPage = ({ query }) => {
  return (
    <>
      <Meta title={`Authorisation for Work Order ${query.id}`} />
      <AuthorisationView workOrderReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

AuthorisationPage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}

AuthorisationPage.permittedRoles = [AUTHORISATION_MANAGER_ROLE]

export default AuthorisationPage
