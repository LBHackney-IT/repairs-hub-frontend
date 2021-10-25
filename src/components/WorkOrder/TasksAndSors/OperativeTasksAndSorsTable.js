import PropTypes from 'prop-types'
import TasksAndSorsRow from './TasksAndSorsRow'
import { Table, THead, TBody, TR, TH, TD } from '../../Layout/Table'
import { calculateTotal } from '../../../utils/helpers/calculations'

const OperativeTasksAndSorsTable = ({
  tasksAndSors,
  tabName,
  workOrderReference,
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
              sorLink={`/work-orders/${workOrderReference}/tasks/${entry.id}/edit`}
              {...entry}
            />
          ))}
          <TR index={tasksAndSors.length} className="lbh-body">
            <TD>{}</TD>
            <TD>{}</TD>
            <TD type="numeric">
              <strong>SMV total</strong>
            </TD>
            <TD type="numeric">
              <strong>
                {calculateTotal(tasks, 'quantity', 'standardMinuteValue')}
              </strong>
            </TD>
          </TR>
        </TBody>
      </>
    )
  }

  return (
    <>
      <h4 className="lbh-heading-h4">{tabName}</h4>
      <Table className="latest-tasks-and-sors-table govuk-!-margin-top-0">
        {buildTable(tasksAndSors)}
      </Table>
      <br />
      <br />
    </>
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
}

export default OperativeTasksAndSorsTable
