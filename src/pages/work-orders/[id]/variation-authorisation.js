import { CONTRACT_MANAGER_ROLE } from '../../../utils/user'
import VariationAuthorisationView from '../../../components/WorkOrder/Authorisation/VariationAuthorisationView'

const VariationAuthorisationPage = ({ query }) => {
  return <VariationAuthorisationView workOrderReference={query.id} />
}
export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

VariationAuthorisationPage.permittedRoles = [CONTRACT_MANAGER_ROLE]

export default VariationAuthorisationPage
