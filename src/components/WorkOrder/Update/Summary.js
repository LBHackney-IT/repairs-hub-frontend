import PropTypes from 'prop-types'
import { PrimarySubmitButton } from '../../Form'
import { calculateTotal } from '@/utils/helpers/calculations'
import { buildVariationFormData } from '@/utils/hact/jobStatusUpdate/variation'
import UpdateSummaryRateScheduleItems from '../RateScheduleItems/UpdateSummaryRateScheduleItems'
import WarningText from '../../Template/WarningText'

const WorkOrderUpdateSummary = ({
  reference,
  onFormSubmit,
  varySpendLimit,
  originalTasks,
  latestTasks,
  addedTasks,
  changeStep,
  variationReason,
  budgetCode,
}) => {
  const onSubmit = async (e) => {
    e.preventDefault()

    // The API validates whether the total variation cost is over the logged in
    // user's vary spend limit & updates WO status to 'Pending Approval' if true
    const WorkOrderUpdateFormData = buildVariationFormData(
      latestTasks,
      addedTasks,
      reference,
      variationReason
    )

    onFormSubmit(WorkOrderUpdateFormData, overSpendLimit)
  }

  const ORIGINAL_COST = 'Original cost'
  const TOTAL_VARIED_COST = 'Variation cost'
  const TOTAL_COST = 'Total cost'

  const original = {
    description: ORIGINAL_COST,
    cost: calculateTotal(originalTasks, 'cost', 'originalQuantity'),
  }
  const total = {
    description: TOTAL_COST,
    cost: calculateTotal(latestTasks.concat(addedTasks), 'cost', 'quantity'),
  }
  const totalVaried = {
    description: TOTAL_VARIED_COST,
    cost: total.cost - original.cost,
  }

  const overSpendLimit = totalVaried.cost.toFixed(2) > varySpendLimit

  return (
    <div>
      <h1 className="lbh-heading-h1">Update work order: {reference}</h1>
      <form role="form" id="repair-request-form" onSubmit={onSubmit}>
        <h4 className="lbh-heading-h4">Summary of updates to work order</h4>

        <UpdateSummaryRateScheduleItems
          originalTasks={originalTasks}
          latestTasks={latestTasks}
          addedTasks={addedTasks}
          changeStep={changeStep}
          originalCostObject={original}
          totalCostObject={total}
          totalVariedCostObject={totalVaried}
          budgetCode={budgetCode}
        />

        <div className="variation-reason-summary lbh-body-s govuk-!-margin-bottom-7">
          <h4 className="lbh-heading-h4">Variation reason</h4>
          <p>{variationReason}</p>
        </div>

        {overSpendLimit && (
          <WarningText
            text={`Your variation cost exceeds £${varySpendLimit} and will be sent for approval.`}
          />
        )}

        <PrimarySubmitButton
          id="submit-work-order-close"
          label="Confirm and close"
        />
      </form>
    </div>
  )
}

WorkOrderUpdateSummary.propTypes = {
  reference: PropTypes.string.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  varySpendLimit: PropTypes.number.isRequired,
  originalTasks: PropTypes.array.isRequired,
  latestTasks: PropTypes.array.isRequired,
  addedTasks: PropTypes.array,
  changeStep: PropTypes.func.isRequired,
  variationReason: PropTypes.string.isRequired,
  budgetCode: PropTypes.object,
}

export default WorkOrderUpdateSummary
