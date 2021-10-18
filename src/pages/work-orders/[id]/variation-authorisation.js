import { CONTRACT_MANAGER_ROLE } from '../../../utils/user'
import VariationAuthorisationView from '../../../components/WorkOrder/Authorisation/VariationAuthorisationView'
import Meta from '../../../components/Meta'
import { getQueryProps } from '../../../utils/helpers/serverSideProps'

const VariationAuthorisationPage = ({ query }) => {
  return (
    <>
      <Meta title={`Authorise variation for Work Order ${query.id}`} />
      <VariationAuthorisationView workOrderReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

VariationAuthorisationPage.permittedRoles = [CONTRACT_MANAGER_ROLE]

export default VariationAuthorisationPage
