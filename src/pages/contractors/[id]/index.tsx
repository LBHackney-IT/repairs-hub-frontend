import Meta from '@/components/Meta'
import ContractorView from '@/root/src/components/ContractsDashboard/Contractor/ContractorView'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import { CONTRACT_ADMIN_ROLE, DATA_ADMIN_ROLE } from '@/utils/user'

const ContractPage = ({ query }) => {
  return (
    <>
      <Meta title={`Contractor ${query.id}`} />
      <ContractorView contractorReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

ContractPage.permittedRoles = [DATA_ADMIN_ROLE, CONTRACT_ADMIN_ROLE]

export default ContractPage
