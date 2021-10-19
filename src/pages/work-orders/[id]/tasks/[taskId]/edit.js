import { OPERATIVE_ROLE } from '../../../../../utils/user'
import Meta from '../../../../../components/Meta'
import { getQueryProps } from '../../../../../utils/helpers/serverSideProps'
import UpdateTaskView from '../../../../../components/WorkOrder/TasksAndSors/UpdateTaskView'

const EditWorkOrderTaskPage = ({ query }) => {
  return (
    <>
      <Meta title={`Update Work Order ${query.id}`} />

      <UpdateTaskView workOrderReference={query.id} taskId={query.taskId} />
    </>
  )
}

export const getServerSideProps = getQueryProps

EditWorkOrderTaskPage.permittedRoles = [OPERATIVE_ROLE]

export default EditWorkOrderTaskPage
