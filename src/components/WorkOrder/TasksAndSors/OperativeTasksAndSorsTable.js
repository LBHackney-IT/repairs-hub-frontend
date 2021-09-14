import PropTypes from 'prop-types'
import TasksAndSorsRow from './TasksAndSorsRow'
import { Table, THead, TBody, TR, TH, TD } from '../../Layout/Table'
import { calculateTotal } from '../../../utils/helpers/calculations'

const OperativeTasksAndSorsTable = ({ tasksAndSors, tabName }) => {
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
              {...entry}
            />
          ))}
          <TR index={tasksAndSors.length} className="lbh-body-s">
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
      <h2 className="lbh-heading-h2">{tabName}</h2>
      <Table className="govuk-!-margin-top-5 latest-tasks-and-sors-table">
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
