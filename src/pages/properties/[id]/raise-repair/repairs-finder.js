import { getQueryProps } from '@/utils/helpers/serverSideProps'
import RepairsFinderFormView from '@/components/Property/RepairsFinder/RepairsFinderFormView'

import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACT_MANAGER_ROLE,
} from '@/utils/user'

const RepairsFinderPage = ({ query }) => {
  return <RepairsFinderFormView propertyReference={query.id} />
}

export const getServerSideProps = getQueryProps

RepairsFinderPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
]

export default RepairsFinderPage
