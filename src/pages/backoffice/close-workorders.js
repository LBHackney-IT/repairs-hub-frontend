import { DATA_ADMIN_ROLE } from 'src/utils/user'

import Meta from '../../components/Meta'

import { getQueryProps } from '../../utils/helpers/serverSideProps'
import CloseWorkOrders from '../../components/BackOffice/CloseWorkOrders'

const CloseWorkOrdersPage = () => {
  return (
    <>
      <Meta title="BackOffice" />
      <CloseWorkOrders />
    </>
  )
}

export const getServerSideProps = getQueryProps

CloseWorkOrdersPage.permittedRoles = [DATA_ADMIN_ROLE]

export default CloseWorkOrdersPage
