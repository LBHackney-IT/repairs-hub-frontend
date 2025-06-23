import { DATA_ADMIN_ROLE } from '@/utils/user'
import Meta from '../../components/Meta'
import { getQueryProps } from '../../utils/helpers/serverSideProps'
import BackOfficeDashboard from '../../components/BackOffice/BackOfficeDashboard'
import BackOfficeLayout from '../../components/BackOffice/BackOfficeLayout'

const BackOfficePage = () => {
  return (
    <>
      <BackOfficeLayout>
        <Meta title="BackOffice" />

        <BackOfficeDashboard />
      </BackOfficeLayout>
    </>
  )
}

export const getServerSideProps = getQueryProps

BackOfficePage.permittedRoles = [DATA_ADMIN_ROLE]

export default BackOfficePage
