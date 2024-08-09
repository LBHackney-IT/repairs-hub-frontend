import Meta from '@/components/Meta'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import { OPERATIVE_ROLE } from '@/utils/user'
import MobileWorkingWorkOrderView from '../../../../../components/WorkOrder/MobileWorkingWorkOrderView'
import PropTypes from 'prop-types'

const OperativeWorkOrderPage = ({ query }) => {
  // This page was created so users in operative and other groups
  // can access a work order via different links to take different actions.

  // We intentionally do nothing with the operativeId supplied in the query
  // Instead the API is relied upon to check operative work order access.
  return (
    <>
      <Meta title={`Work Order ${query.id}`} />
      <MobileWorkingWorkOrderView workOrderReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

OperativeWorkOrderPage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}

OperativeWorkOrderPage.permittedRoles = [OPERATIVE_ROLE]

export default OperativeWorkOrderPage
