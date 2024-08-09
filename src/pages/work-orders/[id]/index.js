import Meta from '@/components/Meta'
import WorkOrderView from '@/components/WorkOrder/WorkOrderView'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import PropTypes from 'prop-types'

import { ALL_ROLES } from '@/utils/user'

const WorkOrderPage = ({ query }) => {
  return (
    <>
      <Meta title={`Work Order ${query.id}`} />
      <WorkOrderView workOrderReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

WorkOrderPage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}

WorkOrderPage.permittedRoles = [...ALL_ROLES]

export default WorkOrderPage
