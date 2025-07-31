import { getQueryProps } from '@/utils/helpers/serverSideProps'
import RaiseWorkOrderFormView from '@/components/Property/RaiseWorkOrderRepairsFinder/RaiseWorkOrderFormView'

import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACT_MANAGER_ROLE,
} from '@/utils/user'

const RaiseRepairPage = ({ query }) => {
  return <RaiseWorkOrderFormView propertyReference={query.id} />
}

export const getServerSideProps = getQueryProps

RaiseRepairPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
]

export default RaiseRepairPage
