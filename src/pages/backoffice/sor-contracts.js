import { DATA_ADMIN_ROLE } from '@/utils/user'

import Meta from '../../components/Meta'
import BackOfficeLayout from '../../components/BackOffice/BackOfficeLayout'

import { getQueryProps } from '../../utils/helpers/serverSideProps'
import SORContracts from '../../components/BackOffice/SORContracts'

const SORContractsPage = () => {
  return (
    <>
      <BackOfficeLayout>
        <Meta title="BackOffice" />
        <SORContracts />
      </BackOfficeLayout>
    </>
  )
}

export const getServerSideProps = getQueryProps

SORContractsPage.permittedRoles = [DATA_ADMIN_ROLE]

export default SORContractsPage
