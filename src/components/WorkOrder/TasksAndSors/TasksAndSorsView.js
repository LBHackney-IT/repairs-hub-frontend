import PropTypes from 'prop-types'
import TasksAndSorsTable from './TasksAndSorsTable'
import { sortArrayByDate } from '@/utils/helpers/array'
import { areTasksUpdated } from '@/utils/tasks'

const TasksAndSorsView = ({ tabName, tasksAndSors, budgetCode }) => {
  const originalTasksAndSors = tasksAndSors.filter((t) => t.original)

  return (
    tasksAndSors &&
    tasksAndSors.length > 0 && (
      <TasksAndSorsTable
        /**
                Latest refers to the latest (live) tasks and sors against the work order,
                which will include any variations for different codes and quantities
                whereas original refers to the tasks and sors that originated from
                the raise repair form, along with its original quantity
              **/
        latestTasksAndSors={sortArrayByDate(tasksAndSors, 'dateAdded')}
        originalTasksAndSors={sortArrayByDate(
          originalTasksAndSors,
          'dateAdded'
        )}
        tasksWereUpdated={areTasksUpdated(tasksAndSors)}
        tabName={tabName}
        budgetCode={budgetCode}
      />
    )
  )
}

TasksAndSorsView.propTypes = {
  tabName: PropTypes.string.isRequired,
}

export default TasksAndSorsView
