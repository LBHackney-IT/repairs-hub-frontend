import Meta from '../../../components/Meta'
import WorkOrderView from '../../../components/WorkOrder/WorkOrderView'
import OperativeWorkOrderView from '../../../components/WorkOrder/OperativeWorkOrderView'
import UserContext from '../../../components/UserContext/UserContext'
import { useContext } from 'react'

import {
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
} from '../../../utils/user'

import { canSeeWorkOrders } from '../../../utils/userPermissions'

const WorkOrderPage = ({ query }) => {
  const { user } = useContext(UserContext)
  return (
    <>
      <Meta title={`Work Order ${query.id}`} />
      {user && canSeeWorkOrders(user) ? (
        <WorkOrderView workOrderReference={query.id} />
      ) : (
        <OperativeWorkOrderView workOrderReference={query.id} />
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

WorkOrderPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  OPERATIVE_ROLE,
]

export default WorkOrderPage
