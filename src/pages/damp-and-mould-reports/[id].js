import Meta from '@/components/Meta'
import { getQueryProps } from '@/utils/helpers/serverSideProps'

import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from '@/utils/user'
import DampAndMouldReportsPropertyViewLayout from '../../components/DampAndMouldReports/components/DampAndMouldReportsPropertyViewLayout'

const DampAndMouldReportsPage = ({ query }) => {
  return (
    <>
      <Meta title={`Damp and Mould reports`} />
      <DampAndMouldReportsPropertyViewLayout propertyReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

DampAndMouldReportsPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
]

export default DampAndMouldReportsPage
