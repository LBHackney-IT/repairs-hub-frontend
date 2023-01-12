import {
  DATA_ADMIN,
} from '@/utils/user'

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

BackOfficePage.permittedRoles = [
  DATA_ADMIN,
]

export default BackOfficePage
