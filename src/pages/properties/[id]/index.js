import PropertyView from '../../../components/Property/PropertyView'
import { getQueryProps } from '../../../utils/helpers/serverSideProps'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACT_MANAGER_ROLE,
} from '../../../utils/user'

const PropertyPage = ({ query }) => {
  return <PropertyView propertyReference={query.id} />
}

export const getServerSideProps = getQueryProps

PropertyPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
]

export default PropertyPage
