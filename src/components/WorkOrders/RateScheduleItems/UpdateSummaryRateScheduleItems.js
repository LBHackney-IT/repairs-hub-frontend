import PropTypes from 'prop-types'
import cx from 'classnames'
import { Table, THead, TBody, TR, TH } from '../../Layout/Table'

const UpdateSummaryRateScheduleItems = ({
  originalTasks,
  latestTasks,
  addedTasks,
  changeStep,
  originalCostObject,
  totalCostObject,
  totalVariedCostObject,
}) => {
  const showCostBreakdown = () => {
    return [originalCostObject, totalVariedCostObject, totalCostObject].map(
      (object, index) => (
        <tr
          key={index}
          className="govuk-table__row"
          id={object.description.toLowerCase().replace(/\s/g, '-')}
        >
          <th scope="row">{}</th>
          <td
            className={cx('govuk-!-padding-top-3', {
              'border-top-black':
                object.description === totalCostObject.description,
            })}
          >
            <strong>{object.description}</strong>
          </td>
          <td
            className={cx('govuk-!-padding-top-3', {
              'border-top-black':
                object.description === totalCostObject.description,
            })}
          >
            £{object.cost.toFixed(2)}
          </td>
          <td>{}</td>
        </tr>
      )
    )
  }

  const rateScheduleItemsTable = (
    tasks,
    isExisting = false,
    isOriginal = false
  ) => {
    let dataAttribute

    if (isExisting) {
      dataAttribute = 'existing-task'
    } else if (isOriginal) {
      dataAttribute = 'original-task'
    } else {
      dataAttribute = 'added-task'
    }

    return tasks.map((task, index) => (
      <tr
        className="govuk-table__row"
        key={`${dataAttribute}-${index}`}
        id={`${dataAttribute}-${index}`}
      >
        <th scope="row" className="govuk-table__header">
          {[task.code, task.description].filter(Boolean).join(' - ')}
        </th>
        <td className="govuk-table__cell">
          {dataAttribute === 'original-task'
            ? task.originalQuantity
            : task.quantity}
        </td>
        <td className="govuk-table__cell">£{parseFloat(task.cost)}</td>
        {dataAttribute !== 'original-task' && (
          <td className="govuk-table__cell">
            <a onClick={changeStep} href="#">
              Edit
            </a>
          </td>
        )}
      </tr>
    ))
  }

  const buildTableTemplate = (...callbacks) => {
    return (
      <>
        <THead>
          <TR className="lbh-body">
            <TH scope="col" width="one-half">
              SOR code
            </TH>
            <TH scope="col" width="one-quarter">
              Quantity
            </TH>
            <TH scope="col" width="one-quarter">
              Cost (unit)
            </TH>
            <TH scope="col">{''}</TH>
          </TR>
        </THead>
        <TBody>{callbacks}</TBody>
      </>
    )
  }

  return (
    <>
      <p className="lbh-heading-h4">Original Tasks and SORs</p>
      <Table className="original-tasks-table">
        {buildTableTemplate(rateScheduleItemsTable(originalTasks, false, true))}
      </Table>

      <p className="lbh-heading-h4">Updated Tasks and SORs</p>
      <Table className="updated-tasks-table">
        {buildTableTemplate(
          rateScheduleItemsTable(latestTasks, true),
          rateScheduleItemsTable(addedTasks),
          showCostBreakdown()
        )}
      </Table>
    </>
  )
}

UpdateSummaryRateScheduleItems.propTypes = {
  originalTasks: PropTypes.array.isRequired,
  latestTasks: PropTypes.array,
  addedTasks: PropTypes.array,
  changeStep: PropTypes.func,
  originalCostObject: PropTypes.object.isRequired,
  totalCostObject: PropTypes.object.isRequired,
  totalVariedCostObject: PropTypes.object.isRequired,
}

export default UpdateSummaryRateScheduleItems
