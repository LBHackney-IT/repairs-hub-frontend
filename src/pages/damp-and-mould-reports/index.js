import Meta from '@/components/Meta'
import { getQueryProps } from '@/utils/helpers/serverSideProps'

import { DATA_ADMIN_ROLE, DAMP_AND_MOULD_MANAGER_ROLE } from '@/utils/user'
import DampAndMouldReportsView from '../../components/DampAndMouldReports/views/DampAndMouldReportsView'

const DampAndMouldReportsPage = () => {
  return (
    <>
      <Meta title={`Damp and mould reports`} />
      <DampAndMouldReportsView />
    </>
  )
}

export const getServerSideProps = getQueryProps

DampAndMouldReportsPage.permittedRoles = [
  DAMP_AND_MOULD_MANAGER_ROLE,
  DATA_ADMIN_ROLE,
]

export default DampAndMouldReportsPage
