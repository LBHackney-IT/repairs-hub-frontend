import Meta from '@/components/Meta'
import ContractView from '@/root/src/components/BackOffice/ContractsDashboard/Contract/ContractView'
import BackOfficeLayout from '@/root/src/components/BackOffice/BackOfficeLayout'
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
      <BackOfficeLayout>
        <Meta title={`Contract ${query.id}`} />
        <ContractView contractReference={query.id} />
      </BackOfficeLayout>
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
