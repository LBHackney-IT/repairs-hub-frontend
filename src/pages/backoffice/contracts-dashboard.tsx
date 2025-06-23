import { DATA_ADMIN_ROLE } from '@/utils/user'
import Meta from '../../components/Meta'
import { getQueryProps } from '../../utils/helpers/serverSideProps'
import ContractsDashboard from '../../components/BackOffice/ContractsDashboard'
import BackOfficeLayout from '../../components/BackOffice/BackOfficeLayout'

const ContractsDashboardPage = () => {
  return (
    <>
      <BackOfficeLayout>
        <Meta title="ContractsDashboard" />

        <ContractsDashboard />
      </BackOfficeLayout>
    </>
  )
}

export const getServerSideProps = getQueryProps

ContractsDashboardPage.permittedRoles = [DATA_ADMIN_ROLE]

export default ContractsDashboardPage
