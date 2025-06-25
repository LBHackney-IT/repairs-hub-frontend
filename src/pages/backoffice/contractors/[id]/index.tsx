import Meta from '@/components/Meta'
import ContractorListItem from '@/root/src/components/BackOffice/ContractsDashboard/ContractorListItem'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACT_MANAGER_ROLE,
  DATA_ADMIN_ROLE,
} from '@/utils/user'

const ContractPage = ({ query }) => {
  return (
    <>
      <Meta title={`Contractor ${query.id}`} />
      <ContractorListItem contractorReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

ContractPage.permittedRoles = [
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACT_MANAGER_ROLE,
  DATA_ADMIN_ROLE,
]

export default ContractPage
