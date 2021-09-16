import { useContext } from 'react'
import Meta from '../../../components/Meta'
import UserContext from '../../../components/UserContext/UserContext'
import CloseWorkOrderByProxy from '../../../components/WorkOrders/CloseWorkOrderByProxy'
import CloseWorkOrder from '../../../components/WorkOrders/CloseWorkOrder'
import {
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from '../../../utils/user'
import { canAttendOwnWorkOrder } from '../../../utils/userPermissions'

const WorkOrderClosePage = ({ query }) => {
  const { user } = useContext(UserContext)

  return (
    <>
      <Meta title={`Close Work Order ${query.id}`} />
      {canAttendOwnWorkOrder(user) ? (
        <CloseWorkOrder reference={query.id} />
      ) : (
        <CloseWorkOrderByProxy reference={query.id} />
      )}
    </>
  )
}
export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

WorkOrderClosePage.permittedRoles = [
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  OPERATIVE_ROLE,
]

export default WorkOrderClosePage
