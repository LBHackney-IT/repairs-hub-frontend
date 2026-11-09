import RaiseWorkOrderFormView from '@/components/Property/RaiseWorkOrder/RaiseWorkOrderFormView'
import { getQueryProps } from '@/utils/helpers/serverSideProps'

import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACT_MANAGER_ROLE,
} from '@/utils/user'
import type { PageProps } from '@/types/page'

const RaiseRepairPage = ({ query }: PageProps<{ id: string }>) => {
  return <RaiseWorkOrderFormView propertyReference={query.id} />
}

export const getServerSideProps = getQueryProps

RaiseRepairPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
]

export default RaiseRepairPage
