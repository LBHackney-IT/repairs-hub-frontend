import Meta from '@/components/Meta'
import EditWorkOrderDescription from '@/root/src/components/WorkOrder/EditWorkOrderDescription'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import {
  AGENT_ROLE,
  AUTHORISATION_MANAGER_ROLE,
  CONTRACT_MANAGER_ROLE,
  DATA_ADMIN_ROLE,
} from '@/utils/user'

const EditPage = ({ query }) => {
  return (
    <>
      <Meta title={`Edit Work Order description ${query.id}`} />
      <EditWorkOrderDescription workOrderReference={query.id} />
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
