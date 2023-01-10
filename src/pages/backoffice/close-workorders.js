import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from '@/utils/user'
import Meta from '../../components/Meta'

import { getQueryProps } from '../../utils/helpers/serverSideProps'
import CloseWorkOrders from '../../components/BackOffice/CloseWorkOrders'

const CloseWorkOrdersPage = () => {
  return (
    <>
      <Meta title="BackOffice" />
      <CloseWorkOrders />
    </>
  )
}

export const getServerSideProps = getQueryProps

CloseWorkOrdersPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
]

export default CloseWorkOrdersPage
