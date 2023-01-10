import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from '@/utils/user'
import Meta from '../../components/Meta'
import { getQueryProps } from '../../utils/helpers/serverSideProps'
import BackOfficeDashboard from '../../components/BackOffice/BackOfficeDashboard'

const BackOfficePage = () => {
  return (
    <>
      <Meta title="BackOffice" />

      <BackOfficeDashboard />
    </>
  )
}

export const getServerSideProps = getQueryProps

BackOfficePage.permittedRoles = [
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
]

export default BackOfficePage
