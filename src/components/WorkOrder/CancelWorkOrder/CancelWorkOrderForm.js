import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { PrimarySubmitButton, CharacterCountLimitedTextArea } from '../../Form'
import WorkOrderInfoTable from '../WorkOrderInfoTable'
import BackButton from '../../Layout/BackButton/BackButton'
import { buildCancelWorkOrderFormData } from '../../../utils/hact/work-order-complete/cancel-work-order-form'
import WarningText from '../../Template/WarningText'
import { highPriorityCodes } from '../../../utils/helpers/priorities'
import { isContractorScheduledInternally } from '../../../utils/helpers/work-orders'

const CancelWorkOrderForm = ({ workOrder, onFormSubmit }) => {
  const { register, handleSubmit, errors } = useForm()

  const onSubmit = async (formData) => {
    const cancelWorkOrderFormData = buildCancelWorkOrderFormData(formData)

    onFormSubmit(cancelWorkOrderFormData)
  }

  const isHighPriority = (code) => highPriorityCodes.includes(code)

  return (
    <div className="govuk-width-container">
      <BackButton />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-caption-l">Cancel repair</span>
          <h1 className="lbh-heading-l govuk-!-margin-bottom-2">
            Works order: {workOrder.reference}
          </h1>

          <WorkOrderInfoTable workOrder={workOrder} />

          {isContractorScheduledInternally(workOrder.contractorReference) &&
            isHighPriority(workOrder.priorityCode) && (
              <WarningText text="For immediate or emergency jobs contact planner first." />
            )}

          {isContractorScheduledInternally(workOrder.contractorReference) && (
            <WarningText text="For next day jobs contact planners if before 3pm, contact repairs admin if after 3pm." />
          )}

          {isContractorScheduledInternally(workOrder.contractorReference) && (
            <WarningText text="For jobs on the current day contact the operative first. If they have already started work do not cancel." />
          )}

          <h2 className="lbh-heading-h2 govuk-!-margin-top-6">
            Reason to cancel
          </h2>

          <form
            role="form"
            id="cancel-work-order-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              id="workOrderReference"
              name="workOrderReference"
              label="workOrderReference"
              type="hidden"
              value={workOrder.reference}
              ref={register}
            />
            <CharacterCountLimitedTextArea
              name="cancelReason"
              label="Reason"
              required={true}
              requiredText="Please enter a reason"
              register={register}
              maxLength={200}
              error={errors && errors.cancelReason}
            />

            <PrimarySubmitButton label="Cancel repair" />
          </form>
        </div>
      </div>
    </div>
  )
}

CancelWorkOrderForm.propTypes = {
  workOrder: PropTypes.object.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
}

export default CancelWorkOrderForm
