import PropTypes from 'prop-types'
import TasksAndSorsRow from './TasksAndSorsRow'
import { Table, THead, TBody, TR, TH } from '../../Layout/Table'

const TasksAndSorsTable = ({
  latestTasksAndSors,
  originalTasksAndSors,
  tabName,
}) => {
  const buildTable = (tasks, isOriginal = false) => {
    return (
      <>
        <THead>
          <TR className="govuk-body">
            <TH scope="col">SOR</TH>
            <TH scope="col">Description</TH>
            <TH scope="col">Date added</TH>
            <TH scope="col">Quantity (est.)</TH>
            <TH scope="col">Cost (est.)</TH>
            <TH scope="col">Status</TH>
          </TR>
        </THead>
        <TBody>
          {tasks.map((entry, index) => (
            <TasksAndSorsRow
              key={index}
              index={index}
              taskQuantity={
                isOriginal ? entry.originalQuantity : entry.quantity
              }
              {...entry}
            />
          ))}
        </TBody>
      </>
    )
  }

  return (
    <>
      <h2 className="govuk-heading-l">{tabName}</h2>

      <p className="govuk-heading-s">Latest Tasks and SORs</p>
      <Table className="govuk-!-margin-top-5 latest-tasks-and-sors-table">
        {buildTable(latestTasksAndSors)}
      </Table>

      <p className="govuk-heading-s">Original Tasks and SORs</p>
      <Table className="govuk-!-margin-top-5 original-tasks-and-sors-table">
        {buildTable(originalTasksAndSors, true)}
      </Table>
    </>
  )
}

TasksAndSorsTable.propTypes = {
  tabName: PropTypes.string.isRequired,
  originalTasksAndSors: PropTypes.array.isRequired,
  latestTasksAndSors: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      description: PropTypes.string,
      dateAdded: PropTypes.instanceOf(Date),
      original: PropTypes.bool,
      quantity: PropTypes.number,
      cost: PropTypes.number,
      status: PropTypes.string,
    })
  ).isRequired,
}

export default TasksAndSorsTable
