import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { PrimarySubmitButton } from '../Form'
import { calculateTotalCost } from '../../utils/helpers/calculations'

const SummaryUpdateJob = ({
  reference,
  onJobSubmit,
  tasks,
  addedTasks,
  changeStep,
}) => {
  const { handleSubmit } = useForm({})

  const showCostBreakdown = (allTasks) => {
    const totalCost = calculateTotalCost(allTasks, 'cost', 'quantity')

    return (
      <tr className="govuk-table__row">
        <th scope="row">{}</th>
        <td className="govuk-!-padding-top-5">
          <strong>Total cost</strong>
        </td>
        <td className="govuk-!-padding-top-5" id="total-cost">
          £{totalCost.toFixed(2)}
        </td>
        <td>{}</td>
      </tr>
    )
  }

  const rateScheduleItemsTable = (data, isExisting = false) => {
    let dataAttribute = isExisting ? 'existing-task' : 'added-task'
    return data.map((t, index) => (
      <tr
        className={`tasks-${index} govuk-table__row`}
        key={`${dataAttribute}-${index}`}
        id={`${dataAttribute}-${index}`}
      >
        <th scope="row" className={`sor-code-${index} govuk-table__header`}>
          {[t.code, t.description].filter(Boolean).join(' - ')}
        </th>
        <td className={`quantity-${index} govuk-table__cell`}>{t.quantity}</td>
        <td className={`cost-${index} govuk-table__cell`}>
          £{parseFloat(t.cost) || 0}
        </td>
        <td className={`edit-${index} govuk-table__cell`}>
          <a onClick={changeStep} href="#">
            Edit
          </a>
        </td>
      </tr>
    ))
  }

  return (
    <div>
      <h1 className="govuk-heading-l">Update work order: {reference}</h1>
      <form
        role="form"
        id="repair-request-form"
        onSubmit={handleSubmit(onJobSubmit)}
      >
        <p className="govuk-heading-s">Summary of updates to work order</p>
        <p className="govuk-heading-s">Tasks and SORs</p>
        <table className="govuk-table">
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th scope="col" className="govuk-table__header">
                SOR code
              </th>
              <th scope="col" className="govuk-table__header">
                Quantity
              </th>
              <th scope="col" className="govuk-table__header">
                Cost
              </th>
              <th scope="col" className="govuk-table__header">
                {''}
              </th>
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            {rateScheduleItemsTable(tasks, true)}
            {rateScheduleItemsTable(addedTasks)}
            {showCostBreakdown(tasks.concat(addedTasks))}
          </tbody>
        </table>
        <PrimarySubmitButton label="Confirm and close" />
      </form>
    </div>
  )
}

SummaryUpdateJob.propTypes = {
  reference: PropTypes.string.isRequired,
  onJobSubmit: PropTypes.func.isRequired,
  addedTasks: PropTypes.array,
  changeStep: PropTypes.func.isRequired,
}

export default SummaryUpdateJob
