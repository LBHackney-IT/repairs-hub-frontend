import PropTypes from 'prop-types'
import { PrimarySubmitButton } from '../Form'
import { calculateTotalCost } from '../../utils/helpers/calculations'
import { buildUpdateWorkOrder } from '../../utils/hact/job-status-update/update-job'
import UpdateSummaryRateScheduleItems from './RateScheduleItems/UpdateSummaryRateScheduleItems'
import WarningText from '../Template/WarningText'

const SummaryUpdateWorkOrder = ({
  reference,
  onFormSubmit,
  varySpendLimit,
  originalTasks,
  latestTasks,
  addedTasks,
  changeStep,
  variationReason,
}) => {
  const onSubmit = async () => {
    // The API validates whether the total variation cost is over the logged in
    // user's vary spend limit & updates WO status to 'Pending Approval' if true
    const UpdateWorkOrderFormData = buildUpdateWorkOrder(
      latestTasks,
      addedTasks,
      reference,
      variationReason
    )

    onFormSubmit(UpdateWorkOrderFormData, overSpendLimit)
  }

  const ORIGINAL_COST = 'Original cost'
  const TOTAL_VARIED_COST = 'Variation cost'
  const TOTAL_COST = 'Total cost'

  const original = {
    description: ORIGINAL_COST,
    cost: calculateTotalCost(originalTasks, 'cost', 'originalQuantity'),
  }
  const total = {
    description: TOTAL_COST,
    cost: calculateTotalCost(
      latestTasks.concat(addedTasks),
      'cost',
      'quantity'
    ),
  }
  const totalVaried = {
    description: TOTAL_VARIED_COST,
    cost: total.cost - original.cost,
  }

  const overSpendLimit = totalVaried.cost.toFixed(2) > varySpendLimit

  return (
    <div>
      <h1 className="lbh-heading-l">Update work order: {reference}</h1>
      <form role="form" id="repair-request-form" onSubmit={onSubmit}>
        <p className="lbh-heading-h4">Summary of updates to work order</p>

        <UpdateSummaryRateScheduleItems
          originalTasks={originalTasks}
          latestTasks={latestTasks}
          addedTasks={addedTasks}
          changeStep={changeStep}
          originalCostObject={original}
          totalCostObject={total}
          totalVariedCostObject={totalVaried}
        />

        <div className="variation-reason-summary lbh-body-s govuk-!-margin-bottom-7">
          <p className="lbh-heading-h4">Variation reason</p>
          <p>{variationReason}</p>
        </div>

        {overSpendLimit && (
          <WarningText
            text={`Your variation cost exceeds £${varySpendLimit} and will be sent for approval.`}
          />
        )}

        <PrimarySubmitButton label="Confirm and close" />
      </form>
    </div>
  )
}

SummaryUpdateWorkOrder.propTypes = {
  reference: PropTypes.string.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  varySpendLimit: PropTypes.number.isRequired,
  originalTasks: PropTypes.array.isRequired,
  latestTasks: PropTypes.array.isRequired,
  addedTasks: PropTypes.array,
  changeStep: PropTypes.func.isRequired,
  variationReason: PropTypes.string.isRequired,
}

export default SummaryUpdateWorkOrder
