import PropTypes from 'prop-types'
import TasksAndSorsRow from './TasksAndSorsRow'

const TasksAndSorsTable = ({ tasksAndSors, tabName }) => (
  <>
    <h2 className="govuk-heading-l">{tabName}</h2>

    <table className="govuk-table govuk-!-margin-top-5 tasks-and-sors-table">
      <thead className="govuk-table__head">
        <tr className="govuk-table__row govuk-body">
          <th scope="col" className="govuk-table__header">
            SOR
          </th>
          <th scope="col" className="govuk-table__header">
            Description
          </th>
          <th scope="col" className="govuk-table__header">
            Date added
          </th>
          <th scope="col" className="govuk-table__header">
            Quantity (est.)
          </th>
          <th scope="col" className="govuk-table__header">
            Cost (est.)
          </th>
          <th scope="col" className="govuk-table__header">
            Status
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {tasksAndSors.map((entry, index) => (
          <TasksAndSorsRow key={index} index={index} {...entry} />
        ))}
      </tbody>
    </table>
  </>
)

TasksAndSorsTable.propTypes = {
  tabName: PropTypes.string.isRequired,
  tasksAndSors: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      description: PropTypes.string,
      dateAdded: PropTypes.instanceOf(Date),
      quantity: PropTypes.number,
      cost: PropTypes.number,
      status: PropTypes.string,
    })
  ).isRequired,
}

export default TasksAndSorsTable
