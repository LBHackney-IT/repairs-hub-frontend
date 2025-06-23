import { DATA_ADMIN_ROLE } from '@/utils/user'
import Meta from '../../components/Meta'
import BackOfficeLayout from '@/root/src/components/BackOffice/BackOfficeLayout'

import { getQueryProps } from '../../utils/helpers/serverSideProps'
import AddSORCodes from '../../components/BackOffice/AddSORCodes'

const AddSORCodesPage = () => {
  return (
    <>
      <BackOfficeLayout>
        <Meta title="BackOffice" />
        <AddSORCodes />
      </BackOfficeLayout>
    </>
  )
}

export const getServerSideProps = getQueryProps

AddSORCodesPage.permittedRoles = [DATA_ADMIN_ROLE]

export default AddSORCodesPage
