import type { WorkOrderTasks } from '@/root/src/models/workOrderTasks'
import TasksAndSorsRow from './TasksAndSorsRow'
import { Table, THead, TBody, TR, TH } from '../../Layout/Table'
import { calculateTotal } from '@/utils/helpers/calculations'

type MobileTask = Pick<
  WorkOrderTasks,
  'code' | 'description' | 'quantity' | 'standardMinuteValue'
> &
  Partial<WorkOrderTasks>

interface Props {
  tasksAndSors: MobileTask[]
  tabName: string
  workOrderReference: string
  readOnly: boolean
}

const MobileWorkingTasksAndSorsTable = ({
  tasksAndSors,
  tabName,
  workOrderReference,
  readOnly,
}: Props) => {
  const buildTable = (tasks: MobileTask[]) => {
    return (
      <>
        <THead>
          <TR className="lbh-body">
            <TH scope="col">Qty</TH>
            <TH scope="col">SOR</TH>
            <TH scope="col">Description</TH>
            <TH scope="col" type="numeric">
              SMV
            </TH>
          </TR>
        </THead>
        <TBody>
          {tasks.map((entry, index) => (
            <TasksAndSorsRow
              showOperativeTasksAndSorsRow={true}
              key={index}
              index={index}
              taskQuantity={entry.quantity}
              readOnly={readOnly}
              sorLink={`/work-orders/${workOrderReference}/tasks/${entry.id}/edit`}
              {...entry}
            />
          ))}
        </TBody>
      </>
    )
  }

  return (
    <div className="operative-work-order-task-and-sors-table">
      <h2 className="lbh-heading-h2">{tabName}</h2>
      <Table className="latest-tasks-and-sors-table govuk-!-margin-top-0">
        {buildTable(tasksAndSors)}
      </Table>
      <h3 className="lbh-heading-h3 background-wrap-color">
        SMV total{' '}
        {calculateTotal(tasksAndSors, 'quantity', 'standardMinuteValue')}
      </h3>
      <br />
    </div>
  )
}

export default MobileWorkingTasksAndSorsTable
