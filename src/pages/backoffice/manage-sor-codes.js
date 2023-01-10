import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from '@/utils/user'
import Meta from '../../components/Meta'

import { getQueryProps } from '../../utils/helpers/serverSideProps'
import ManageSORCodes from '../../components/BackOffice/ManageSORCodes'

const ManageSORCodesPage = () => {
  return (
    <>
      <Meta title="BackOffice" />
      <ManageSORCodes />
    </>
  )
}

export const getServerSideProps = getQueryProps

ManageSORCodesPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
]

export default ManageSORCodesPage
