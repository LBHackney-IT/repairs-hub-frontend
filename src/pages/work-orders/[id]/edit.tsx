import Meta from '@/components/Meta'
import EditWorkOrderDescriptionWorkOrderDetails from '@/components/WorkOrder/EditWorkOrderDescriptionWorkOrderDetails'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import { CONTRACTOR_ROLE, CONTRACT_MANAGER_ROLE } from '@/utils/user'

const EditWorkOrderDescription = ({ query }) => {
  return (
    <>
      <Meta title={`Edit Work Order description ${query.id}`} />
      <EditWorkOrderDescriptionWorkOrderDetails workOrderReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

EditWorkOrderDescription.permittedRoles = [
  CONTRACTOR_ROLE,
  CONTRACT_MANAGER_ROLE,
]

export default EditWorkOrderDescription
