import PropertyView from '@/components/Property/PropertyView'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACT_MANAGER_ROLE,
  CONTRACTOR_ROLE,
} from '@/utils/user'
import PropTypes from 'prop-types'

const PropertyPage = ({ query }) => {
  return <PropertyView propertyReference={query.id} />
}

export const getServerSideProps = getQueryProps

PropertyPage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}

PropertyPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACTOR_ROLE,
]

export default PropertyPage
