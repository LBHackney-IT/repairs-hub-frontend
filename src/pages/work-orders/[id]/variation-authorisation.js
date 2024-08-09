import { CONTRACT_MANAGER_ROLE } from '@/utils/user'
import VariationAuthorisationView from '@/components/WorkOrder/Authorisation/VariationAuthorisationView'
import Meta from '@/components/Meta'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import PropTypes from 'prop-types'

const VariationAuthorisationPage = ({ query }) => {
  return (
    <>
      <Meta title={`Authorise variation for Work Order ${query.id}`} />
      <VariationAuthorisationView workOrderReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

VariationAuthorisationPage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}

VariationAuthorisationPage.permittedRoles = [CONTRACT_MANAGER_ROLE]

export default VariationAuthorisationPage
