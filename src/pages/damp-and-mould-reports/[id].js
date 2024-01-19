import Meta from '@/components/Meta'
import { getQueryProps } from '@/utils/helpers/serverSideProps'

import { DAMP_AND_MOULD_MANAGER_ROLE, DATA_ADMIN_ROLE } from '@/utils/user'
import DampAndMouldReportsPropertyViewLayout from '../../components/DampAndMouldReports/views/DampAndMouldReportsPropertyViewLayout'

const DampAndMouldReportsPage = ({ query }) => {
  return (
    <>
      <Meta title={`Damp and mould reports`} />
      <DampAndMouldReportsPropertyViewLayout propertyReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

DampAndMouldReportsPage.permittedRoles = [
  DAMP_AND_MOULD_MANAGER_ROLE,
  DATA_ADMIN_ROLE,
]

export default DampAndMouldReportsPage
