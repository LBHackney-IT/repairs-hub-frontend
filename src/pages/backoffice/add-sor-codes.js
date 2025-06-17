import { DATA_ADMIN_ROLE } from '@/root/src/utils/user'
import Meta from '../../components/Meta'

import { getQueryProps } from '../../utils/helpers/serverSideProps'
import AddSORCodes from '../../components/BackOffice/AddSORCodes'

const AddSORCodesPage = () => {
  return (
    <>
      <Meta title="BackOffice" />
      <AddSORCodes />
    </>
  )
}

export const getServerSideProps = getQueryProps

AddSORCodesPage.permittedRoles = [DATA_ADMIN_ROLE]

export default AddSORCodesPage
