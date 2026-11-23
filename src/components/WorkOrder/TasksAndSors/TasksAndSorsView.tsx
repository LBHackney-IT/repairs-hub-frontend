import { WorkOrderTasks } from '../../../models/workOrderTasks'
import SpinnerWithLabel from '../../SpinnerWithLabel'
import ErrorMessage from '../../Errors/ErrorMessage'
import TasksAndSorsTable from './TasksAndSorsTable'
import { sortArrayByDate } from '@/utils/helpers/array'
import { areTasksUpdated } from '@/utils/tasks'

interface Props {
  tabName: string
  tasksAndSors: WorkOrderTasks[]
  tasksAndSorsLoading?: boolean
  tasksAndSorsError?: string | null
  budgetCode?: any
}

const TasksAndSorsView = ({
  tabName,
  tasksAndSors,
  tasksAndSorsLoading,
  tasksAndSorsError,
  budgetCode,
}: Props) => {
  const originalTasksAndSors = (tasksAndSors ?? []).filter((t) => t.original)

  if (tasksAndSorsLoading || tasksAndSorsError) {
    return (
      <>
        <h2 className="lbh-heading-h2 tab-title">{tabName}</h2>
        {tasksAndSorsLoading && (
          <div className="govuk-!-margin-top-6">
            <SpinnerWithLabel label="Fetching tasks and SORs…" />
          </div>
        )}
        {tasksAndSorsError && <ErrorMessage label={tasksAndSorsError} />}
      </>
    )
  }

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
