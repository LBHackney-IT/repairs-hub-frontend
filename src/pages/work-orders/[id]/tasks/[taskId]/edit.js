import { OPERATIVE_ROLE } from '@/utils/user'
import Meta from '@/components/Meta'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import EditTaskForm from '@/components/WorkOrder/TasksAndSors/EditTaskForm'
import PropTypes from 'prop-types'

const EditWorkOrderTaskPage = ({ query }) => {
  return (
    <>
      <Meta title={`Update Work Order ${query.id}`} />

      <EditTaskForm workOrderReference={query.id} taskId={query.taskId} />
    </>
  )
}

export const getServerSideProps = getQueryProps

EditWorkOrderTaskPage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
    taskId: PropTypes.string.isRequired,
  }),
}

EditWorkOrderTaskPage.permittedRoles = [OPERATIVE_ROLE]

export default EditWorkOrderTaskPage
