import Meta from '@/components/Meta'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import { OPERATIVE_ROLE } from 'src/utils/user'
import ConfirmCloseWorkOrderView from '@/root/src/components/WorkOrders/ConfirmCloseWorkOrderView'

const OperativeWorkOrderPage = ({ query }) => {
  return (
    <>
      <Meta title={`Work Order ${query.id} successfully closed`} />
      <ConfirmCloseWorkOrderView workOrderId={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

OperativeWorkOrderPage.permittedRoles = [OPERATIVE_ROLE]

export default OperativeWorkOrderPage
