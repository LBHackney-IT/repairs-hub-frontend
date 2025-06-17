import Meta from '@/components/Meta'
import EditWorkOrder from '@/root/src/components/WorkOrder/EditWorkOrder'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACT_MANAGER_ROLE,
  DATA_ADMIN_ROLE,
} from '@/auth/user'

const EditPage = ({ query }) => {
  return (
    <>
      <Meta title={`Edit Work Order ${query.id}`} />
      <EditWorkOrder workOrderReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

EditPage.permittedRoles = [
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACT_MANAGER_ROLE,
  DATA_ADMIN_ROLE,
]

export default EditPage
