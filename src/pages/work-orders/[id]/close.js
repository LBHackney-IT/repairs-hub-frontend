import Meta from '@/components/Meta'
import CloseWorkOrderByProxy from '@/components/WorkOrders/CloseWorkOrderByProxy'
import { CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE } from '@/utils/user'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import PropTypes from 'prop-types'

const WorkOrderClosePage = ({ query }) => {
  return (
    <>
      <Meta title={`Close Work Order ${query.id}`} />

      <CloseWorkOrderByProxy reference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

WorkOrderClosePage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}

WorkOrderClosePage.permittedRoles = [CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE]

export default WorkOrderClosePage
