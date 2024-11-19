import DrsSyncView from '../../components/BackOffice/DrsSync'
import Meta from '../../components/Meta'
import { getQueryProps } from '../../utils/helpers/serverSideProps'
import { DATA_ADMIN_ROLE } from '../../utils/user'

const DrsSync = () => {
  return (
    <>
      <Meta title="BackOffice" />
      <DrsSyncView />
    </>
  )
}

export const getServerSideProps = getQueryProps

DrsSync.permittedRoles = [DATA_ADMIN_ROLE]

export default DrsSync
