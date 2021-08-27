import { CONTRACT_MANAGER_ROLE } from '../../../models/user'
import VariationAuthorisationView from '../../../components/WorkOrder/Authorisation/VariationAuthorisationView'
import Meta from '../../../components/Meta'

const VariationAuthorisationPage = ({ query }) => {
  return (
    <>
      <Meta title={`Authorise variation for Work Order ${query.id}`} />
      <VariationAuthorisationView workOrderReference={query.id} />
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

VariationAuthorisationPage.permittedRoles = [CONTRACT_MANAGER_ROLE]

export default VariationAuthorisationPage
