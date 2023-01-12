import { DATA_ADMIN } from '@/utils/user'

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

SORContractsPage.permittedRoles = [DATA_ADMIN]

export default SORContractsPage
