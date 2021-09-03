import PropTypes from 'prop-types'
import TasksAndSorsTable from './TasksAndSorsTable'

const TasksAndSorsView = ({ tabName, tasksAndSors }) => {
  const originalTasksAndSors = tasksAndSors.filter((t) => t.original)
  const areTasksUpdated = (tasks) => {
    const originalQuantityIsEqualToCurrentQuantity = (task) =>
      task.originalQuantity === task.quantity
    return !tasks.every(originalQuantityIsEqualToCurrentQuantity)
  }

  const sortTasksByDates = (tasks) => {
    return tasks.sort(function (a, b) {
      return new Date(b.dateAdded) - new Date(a.dateAdded)
    })
  }

  return (
    tasksAndSors && (
      <TasksAndSorsTable
        /**
                Latest refers to the latest (live) tasks and sors against the work order,
                which will include any variations for different codes and quantities
                whereas original refers to the tasks and sors that originated from
                the raise repair form, along with its original quantity
              **/
        latestTasksAndSors={sortTasksByDates(tasksAndSors)}
        originalTasksAndSors={sortTasksByDates(originalTasksAndSors)}
        tasksWereUpdated={areTasksUpdated(tasksAndSors)}
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
