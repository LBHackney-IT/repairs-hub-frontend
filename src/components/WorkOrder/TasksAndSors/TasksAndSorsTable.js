import PropTypes from 'prop-types'
import TasksAndSorsRow from './TasksAndSorsRow'
import { Table, THead, TBody, TR, TH, TD } from '../../Layout/Table'
import Collapsible from 'src/components/Layout/Collapsible/Collapsible'
import { formatDateTime } from '../../../utils/time'
import { calculateTotalCost } from '../../../utils/helpers/calculations'

const TasksAndSorsTable = ({
  latestTasksAndSors,
  originalTasksAndSors,
  tabName,
}) => {
  const calculateTotalSMV = (tasks, neededElement) => {
    return tasks.reduce((a, task) => {
      let cost = task[neededElement] ? task[neededElement] : 0
      return a + cost
    }, 0)
  }

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
              SMV
            </TH>
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
          <TR index={undefined} className="lbh-body-s">
            <TD>{}</TD>
            <TD>{}</TD>
            <TD>{}</TD>
            <TD type="numeric">
              <strong>Total</strong>
            </TD>
            <TD type="numeric">
              <strong>£ {calculateTotalCost(tasks, 'cost', 'quantity')}</strong>
            </TD>
            <TD type="numeric">
              <strong>{calculateTotalSMV(tasks, 'standardMinuteValue')}</strong>
            </TD>
          </TR>
        </TBody>
      </>
    )
  }

  const displayReadableDate = (tasks) => {
    return `Added on ${formatDateTime(tasks[tasks.length - 1].dateAdded)}`
  }
  //add function that shows date correctly

  return (
    <>
      <h2 className="lbh-heading-h2">{tabName}</h2>

      <h4 className="lbh-heading-h4">
        Latest Tasks and SORs{' '}
        {latestTasksAndSors ? displayReadableDate(latestTasksAndSors) : ''}
      </h4>
      <Table className="govuk-!-margin-top-5 latest-tasks-and-sors-table">
        {buildTable(latestTasksAndSors)}
      </Table>
      <Collapsible
        heading={`Original Tasks and SORs 
        ${
          originalTasksAndSors ? displayReadableDate(originalTasksAndSors) : ''
        }`}
      >
        <Table className="govuk-!-margin-top-5 original-tasks-and-sors-table">
          {buildTable(originalTasksAndSors, true)}
        </Table>
      </Collapsible>
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
