import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { Button, CharacterCountLimitedTextArea } from '../../Form'
import WorkOrderInfoTable from '../WorkOrderInfoTable'
import BackButton from '../../Layout/BackButton/BackButton'
import { buildCancelWorkOrderFormData } from '../../../utils/hact/work-order-complete/cancel-work-order-form'

const CancelWorkOrderForm = ({ workOrder, onFormSubmit }) => {
  const { register, handleSubmit, errors } = useForm()

  const onSubmit = async (formData) => {
    const cancelWorkOrderFormData = buildCancelWorkOrderFormData(formData)

    onFormSubmit(cancelWorkOrderFormData)
  }

  return (
    <div className="govuk-width-container">
      <BackButton />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-caption-l">Cancel repair</span>
          <h1 className="govuk-heading-l govuk-!-margin-bottom-2">
            Works order: {workOrder.reference}
          </h1>

          <WorkOrderInfoTable workOrder={workOrder} />

          <h2 className="govuk-heading-m govuk-!-margin-top-6">
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

            <Button label="Cancel repair" type="submit" />
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
