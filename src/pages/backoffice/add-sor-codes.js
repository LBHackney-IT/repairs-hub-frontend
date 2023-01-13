import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from '@/utils/user'
import Meta from '../../components/Meta'

import { getQueryProps } from '../../utils/helpers/serverSideProps'
import AddSORCodes from '../../components/BackOffice/AddSORCodes'

const AddSORCodesPage = () => {
  return (
    <>
      <Meta title="BackOffice" />
      <AddSORCodes />
    </>
  )
}

export const getServerSideProps = getQueryProps

AddSORCodesPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
]

export default AddSORCodesPage
