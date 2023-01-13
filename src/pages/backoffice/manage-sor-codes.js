import { DATA_ADMIN_ROLE } from '@/utils/user'

import Meta from '../../components/Meta'

import { getQueryProps } from '../../utils/helpers/serverSideProps'
import ManageSORCodes from '../../components/BackOffice/ManageSORCodes'

const ManageSORCodesPage = () => {
  return (
    <>
      <Meta title="BackOffice" />
      <ManageSORCodes />
    </>
  )
}

export const getServerSideProps = getQueryProps

ManageSORCodesPage.permittedRoles = [DATA_ADMIN_ROLE]

export default ManageSORCodesPage