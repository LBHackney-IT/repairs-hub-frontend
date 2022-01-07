import PropTypes from 'prop-types'
import TasksAndSorsRow from './TasksAndSorsRow'
import { Table, THead, TBody, TR, TH } from '../../Layout/Table'
import { calculateTotal } from '@/utils/helpers/calculations'

const OperativeTasksAndSorsTable = ({
  tasksAndSors,
  tabName,
  workOrderReference,
  readOnly,
}) => {
  const buildTable = (tasks) => {
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

OperativeTasksAndSorsTable.propTypes = {
  tabName: PropTypes.string.isRequired,
  tasksAndSors: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      description: PropTypes.string,
      quantity: PropTypes.number,
      standardMinuteValue: PropTypes.number,
    })
  ).isRequired,
  readOnly: PropTypes.bool.isRequired,
}

export default OperativeTasksAndSorsTable
