import PropTypes from 'prop-types'
import TasksAndSorsRow from './TasksAndSorsRow'
import { Table, THead, TBody, TR, TH, TD } from '../../Layout/Table'
import Collapsible from 'src/components/Layout/Collapsible/Collapsible'
import { formatDateTime } from '../../../utils/time'
import { calculateTotal } from '../../../utils/helpers/calculations'

const TasksAndSorsTable = ({
  latestTasksAndSors,
  originalTasksAndSors,
  tabName,
  tasksWereUpdated,
}) => {
  const buildTable = (tasks, isOriginal = false) => {
    return (
      <>
        <THead>
          <TR className="lbh-body">
            <TH scope="col">SOR</TH>
            <TH scope="col">Description</TH>
            <TH scope="col">Quantity (est.)</TH>
            <TH scope="col" type="numeric">
              Unit cost
            </TH>
            <TH scope="col" type="numeric">
              Cost (est.)
            </TH>
            <TH scope="col" type="numeric">
              Total SMV
            </TH>
          </TR>
        </THead>
        <TBody>
          {tasks.map((entry, index) => (
            <TasksAndSorsRow
              key={index}
              index={index}
              isOriginal={isOriginal}
              taskQuantity={
                isOriginal ? entry.originalQuantity : entry.quantity
              }
              {...entry}
            />
          ))}
          <TR
            index={
              isOriginal
                ? originalTasksAndSors.length
                : latestTasksAndSors.length
            }
            className="lbh-body-s"
          >
            <TD>{}</TD>
            <TD>{}</TD>
            <TD>{}</TD>
            <TD type="numeric">
              <strong>Total</strong>
            </TD>
            <TD type="numeric">
              <strong>
                £
                {calculateTotal(
                  tasks,
                  'cost',
                  `${isOriginal ? 'originalQuantity' : 'quantity'}`
                ).toFixed(2)}
              </strong>
            </TD>
            <TD type="numeric">
              <strong>
                {calculateTotal(
                  tasks,
                  `${isOriginal ? 'originalQuantity' : 'quantity'}`,
                  'standardMinuteValue'
                )}
              </strong>
            </TD>
          </TR>
        </TBody>
      </>
    )
  }

  const displayReadableDate = (tasks, isOriginal = false) => {
    if (isOriginal || !tasksWereUpdated) {
      return `Added on ${formatDateTime(tasks[0].dateAdded)}`
    } else {
      let latestUpdatedTask = tasks.reduce((a, b) => {
        return new Date(a.dateUpdated) > new Date(b.dateUpdated) ? a : b
      })
      return `Added on ${formatDateTime(latestUpdatedTask.dateUpdated)}`
    }
  }

  return (
    <>
      <h2 className="lbh-heading-h2">{tabName}</h2>

      <h4 className="lbh-heading-h4">
        Latest Tasks and SORs{' '}
        {latestTasksAndSors && latestTasksAndSors.length > 0
          ? displayReadableDate(latestTasksAndSors)
          : ''}
      </h4>
      <Table className="govuk-!-margin-top-5 latest-tasks-and-sors-table">
        {buildTable(latestTasksAndSors)}
      </Table>
      <br />
      <br />
      {tasksWereUpdated ? (
        <Collapsible
          heading={`Original Tasks and SORs 
        ${
          originalTasksAndSors && originalTasksAndSors.length > 0
            ? displayReadableDate(originalTasksAndSors, true)
            : ''
        }`}
          startClosed={true}
        >
          <Table className="govuk-!-margin-top-5 original-tasks-and-sors-table">
            {buildTable(originalTasksAndSors, true)}
          </Table>
        </Collapsible>
      ) : (
        ''
      )}
    </>
  )
}

TasksAndSorsTable.propTypes = {
  tabName: PropTypes.string.isRequired,
  originalTasksAndSors: PropTypes.array.isRequired,
  tasksWereUpdated: PropTypes.bool.isRequired,
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
