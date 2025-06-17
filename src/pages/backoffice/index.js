import { DATA_ADMIN_ROLE } from '@/auth/user'
import Meta from '../../components/Meta'
import { getQueryProps } from '../../utils/helpers/serverSideProps'
import BackOfficeDashboard from '../../components/BackOffice/BackOfficeDashboard'

const BackOfficePage = () => {
  return (
    <>
      <Meta title="BackOffice" />

      <BackOfficeDashboard />
    </>
  )
}

export const getServerSideProps = getQueryProps

BackOfficePage.permittedRoles = [DATA_ADMIN_ROLE]

export default BackOfficePage
