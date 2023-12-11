import { DATA_ADMIN_ROLE } from '@/utils/user'
import Meta from '../../../components/Meta'
import { getQueryProps } from '../../../utils/helpers/serverSideProps'
import OperativeMobileView from '@/root/src/components/BackOffice/OperativeMobileView'

const AddSORCodesPage = () => {
  return (
    <>
      <Meta title="BackOffice" />
      <OperativeMobileView />
    </>
  )
}

export const getServerSideProps = getQueryProps

AddSORCodesPage.permittedRoles = [DATA_ADMIN_ROLE]

export default AddSORCodesPage
