import Meta from '@/components/Meta'
import CloseWorkOrder from '@/components/WorkOrders/CloseWorkOrder'
import { OPERATIVE_ROLE } from '@/utils/user'
import { getQueryProps } from '@/utils/helpers/serverSideProps'

const OperativeWorkOrderClosePage = ({ query }) => {
  // This page was created so users in operative and other groups
  // can access a work order via different links to take different actions.

  // We intentionally do nothing with the operativeId supplied in the query
  // Instead the API is relied upon to check operative work order access.
  return (
    <>
      <Meta title={`Close Work Order ${query.id}`} />

      <CloseWorkOrder reference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

OperativeWorkOrderClosePage.permittedRoles = [OPERATIVE_ROLE]

export default OperativeWorkOrderClosePage
