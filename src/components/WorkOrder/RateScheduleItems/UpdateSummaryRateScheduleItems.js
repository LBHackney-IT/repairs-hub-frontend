import PropTypes from 'prop-types'
import cx from 'classnames'
import { Table, THead, TBody, TR, TH } from '../../Layout/Table'
import BudgetCode from '../BudgetCode'

const UpdateSummaryRateScheduleItems = ({
  originalTasks,
  latestTasks,
  addedTasks,
  changeStep,
  originalCostObject,
  totalCostObject,
  totalVariedCostObject,
  budgetCode,
}) => {
  const showCostBreakdown = () => {
    return [originalCostObject, totalVariedCostObject, totalCostObject].map(
      (object, index) => (
        <tr
          key={index}
          className="govuk-table__row"
          id={object.description.toLowerCase().replace(/\s/g, '-')}
        >
          {index === 0 ? (
            <th scope="row" className="govuk-table__header border-none">
              <BudgetCode budgetCode={budgetCode} />
            </th>
          ) : (
            <th scope="row" />
          )}

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
            <a className="lbh-link" onClick={changeStep} href="#">
              Edit
            </a>
          </td>
        )}
        {dataAttribute == 'original-task' && (
          <td className="govuk-table__cell aligned-row">{''}</td>
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
      <h4 className="lbh-heading-h4">Original Tasks and SORs</h4>
      <Table className="original-tasks-table">
        {buildTableTemplate(rateScheduleItemsTable(originalTasks, false, true))}
      </Table>

      <h4 className="lbh-heading-h4">Updated Tasks and SORs</h4>
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
  budgetCode: PropTypes.object,
}

export default UpdateSummaryRateScheduleItems
