import PropTypes from 'prop-types'
import cx from 'classnames'
import {
  calculateCostBeforeVariation,
  calculateChangeInCost,
  calculateTotalVariedCost,
} from '../../../utils/helpers/calculations'
import { longDateToStr } from '../../../utils/date'

const VariationAuthorisationSummary = ({ variationTasks, originalSors }) => {
  const COST_BEFORE_VARIATION = 'Cost before variation'
  const TOTAL_VARIED_COST = 'Total cost after variation'
  const CHANGE_IN_COST = 'Change in cost'

  const sorStatus = (task) => {
    if (task.currentQuantity == 0 && task.originalQuantity == 0) {
      return 'New'
    }
    if (task.variedQuantity > task.currentQuantity) {
      return 'Increased'
    }
    if (task.variedQuantity < task.currentQuantity) {
      return 'Reduced'
    }
    return 'Unchanged'
  }
  const getCost = (task) => {
    return task.unitCost ? task.unitCost : 0
  }

  //cost calculation before variation, change in cost and total varied coast
  const costBeforeVariation = {
    description: COST_BEFORE_VARIATION,
    cost: calculateCostBeforeVariation(variationTasks.tasks),
  }
  const changeInCost = {
    description: CHANGE_IN_COST,
    cost: calculateChangeInCost(variationTasks.tasks),
  }
  const totalVaried = {
    description: TOTAL_VARIED_COST,
    cost: calculateTotalVariedCost(variationTasks.tasks),
  }

  //show cost breakdown
  const showCostBreakdown = () => {
    return [costBeforeVariation, changeInCost, totalVaried].map(
      (object, index) => (
        <tr
          key={index}
          className="govuk-table__row"
          id={object.description.toLowerCase().replace(/\s/g, '-')}
        >
          <th scope="row">{}</th>
          <th scope="row">{}</th>
          <th scope="row">{}</th>
          <th scope="row">{}</th>
          <th scope="row">{}</th>

          <td
            className={cx('govuk-!-padding-top-3', {
              'border-top-black': object.description !== COST_BEFORE_VARIATION,
            })}
          >
            <strong>{object.description}</strong>
          </td>
          <td
            className={cx('govuk-!-padding-top-3 govuk-table__cell--numeric', {
              'border-top-black': object.description !== COST_BEFORE_VARIATION,
            })}
          >
            £{object.cost}
          </td>
        </tr>
      )
    )
  }

  return (
    <>
      <h2 className="lbh-heading-h2">Summary of Tasks and SORs</h2>
      <h4 className="lbh-heading-h4">Original SORs</h4>
      <table className="govuk-table lbh-table original-sor-summary">
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" className="govuk-table__header">
              SOR code
            </th>
            <th
              scope="col"
              className="govuk-table__header govuk-table__header--numeric"
            >
              Quantity
            </th>
            <th
              scope="col"
              className="govuk-table__header govuk-table__header--numeric"
            >
              Cost
            </th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {originalSors.map((task, index) => (
            <tr index={index} key={index} className="govuk-table__row">
              <td className="govuk-table__cell">
                {task.code} - {task.description}
              </td>
              <td className="govuk-table__cell govuk-table__cell--numeric">
                {task.originalQuantity}
              </td>
              <td className="govuk-table__cell govuk-table__cell--numeric">
                £{task.cost}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 className="lbh-heading-h4">Updated Tasks SORs</h4>
      <br></br>
      <p className="govuk-body">Updated by: {variationTasks.authorName} </p>
      <p className="govuk-body">
        {longDateToStr(variationTasks.variationDate)}{' '}
      </p>
      <div className="lbh-stat">
        <span className="lbh-stat__caption">{variationTasks.notes}</span>
      </div>

      <table className="govuk-table lbh-table updated-tasks-table">
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" className="govuk-table__header">
              SOR Status
            </th>
            <th scope="col" className="govuk-table__header">
              SOR code
            </th>
            <th
              scope="col"
              className="govuk-table__header govuk-table__header--numeric"
            >
              Unit Cost
            </th>
            <th
              scope="col"
              className="govuk-table__header govuk-table__header--numeric"
            >
              Quantity
            </th>
            <th
              scope="col"
              className="govuk-table__header govuk-table__header--numeric"
            >
              Cost
            </th>
            <th
              scope="col"
              className="govuk-table__header govuk-table__header--numeric"
            >
              Varied quantity
            </th>
            <th
              scope="col"
              className="govuk-table__header govuk-table__header--numeric"
            >
              Varied Cost
            </th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {variationTasks.tasks
            ? variationTasks.tasks.map((task, index) => (
                <tr index={index} key={index} className="govuk-table__row">
                  <td className="govuk-table__cell">
                    <span
                      className={`status status-${sorStatus(task)
                        .replace(/\s+/g, '-')
                        .toLowerCase()}`}
                    >
                      {sorStatus(task)}
                    </span>
                  </td>
                  <td className="govuk-table__cell">
                    {task.code}
                    <p>{task.description}</p>
                  </td>
                  <td className="govuk-table__cell govuk-table__cell--numeric">
                    £{getCost(task)}
                  </td>
                  <td className="govuk-table__cell govuk-table__cell--numeric">
                    {task.currentQuantity}
                  </td>
                  <td className="govuk-table__cell govuk-table__cell--numeric">
                    £{getCost(task) * task.currentQuantity}
                  </td>
                  <td className="govuk-table__cell govuk-table__cell--numeric">
                    {task.variedQuantity}
                  </td>
                  <td className="govuk-table__cell govuk-table__cell--numeric">
                    £{getCost(task) * task.variedQuantity}
                  </td>
                </tr>
              ))
            : ''}
          {variationTasks.tasks ? showCostBreakdown() : ''}
        </tbody>
      </table>
    </>
  )
}

VariationAuthorisationSummary.propTypes = {
  variationTasks: PropTypes.object.isRequired,
  originalSors: PropTypes.array.isRequired,
}

export default VariationAuthorisationSummary
