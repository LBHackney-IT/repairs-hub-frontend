import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from '@/utils/user'
import Meta from '../../components/Meta'

import { getQueryProps } from '../../utils/helpers/serverSideProps'
import SORContracts from '../../components/BackOffice/SORContracts'

const SORContractsPage = () => {
  return (
    <>
      <Meta title="BackOffice" />
      <SORContracts />
    </>
  )
}

export const getServerSideProps = getQueryProps

SORContractsPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
]

export default SORContractsPage
