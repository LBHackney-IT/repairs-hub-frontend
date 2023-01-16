import { DATA_ADMIN_ROLE } from '@/utils/user'

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

SORContractsPage.permittedRoles = [DATA_ADMIN_ROLE]

export default SORContractsPage
