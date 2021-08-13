import PropTypes from 'prop-types'
import TasksAndSorsTable from './TasksAndSorsTable'

const TasksAndSorsView = ({ tabName, tasksAndSors }) => {
  const originalTasksAndSors = tasksAndSors.filter((t) => t.original)

  return (
    tasksAndSors && (
      <TasksAndSorsTable
        /**
                Latest refers to the latest (live) tasks and sors against the work order,
                which will include any variations for different codes and quantities
                whereas original refers to the tasks and sors that originated from
                the raise repair form, along with its original quantity
              **/
        latestTasksAndSors={tasksAndSors}
        originalTasksAndSors={originalTasksAndSors}
        tabName={tabName}
      />
    )
  )
}

TasksAndSorsView.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
  tabName: PropTypes.string.isRequired,
}

export default TasksAndSorsView
