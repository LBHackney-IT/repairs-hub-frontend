import { WorkOrderTasks } from '../../../models/workOrderTasks'
import TasksAndSorsTable from './TasksAndSorsTable'
import { sortArrayByDate } from '@/utils/helpers/array'
import { areTasksUpdated } from '@/utils/tasks'

interface Props {
  tabName: string
  tasksAndSors: WorkOrderTasks[]
  budgetCode?: any
}

const TasksAndSorsView = ({ tabName, tasksAndSors, budgetCode }: Props) => {
  const originalTasksAndSors = tasksAndSors.filter((t) => t.original)

  if (!tasksAndSors || tasksAndSors.length === 0) {
    return <h2 className="lbh-heading-h2 tab-title">{tabName}</h2>
  }

  return (
    <>
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
    </>
  )
}

export default TasksAndSorsView
