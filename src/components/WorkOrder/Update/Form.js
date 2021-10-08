import PropTypes from 'prop-types'
import { PrimarySubmitButton, CharacterCountLimitedTextArea } from '../../Form'
import { useForm } from 'react-hook-form'
import OriginalRateScheduleItems from '../RateScheduleItems/OriginalRateScheduleItems'
import LatestRateScheduleItems from '../RateScheduleItems/LatestRateScheduleItems'
import AddedRateScheduleItems from '../RateScheduleItems/AddedRateScheduleItems'

const WorkOrderUpdateForm = ({
  latestTasks,
  originalTasks,
  addedTasks,
  propertyReference,
  contractorReference,
  onGetToSummary,
  setVariationReason,
  variationReason,
}) => {
  const { register, handleSubmit, errors } = useForm()
  const isContractorUpdatePage = true

  return (
    <>
      <form
        role="form"
        id="repair-request-form"
        onSubmit={handleSubmit(onGetToSummary)}
      >
        <OriginalRateScheduleItems originalTasks={originalTasks} />
        <LatestRateScheduleItems
          latestTasks={latestTasks}
          register={register}
          errors={errors}
        />
        <AddedRateScheduleItems
          register={register}
          errors={errors}
          addedTasks={addedTasks}
          isContractorUpdatePage={isContractorUpdatePage}
          propertyReference={propertyReference}
          contractorReference={contractorReference}
        />
        <CharacterCountLimitedTextArea
          name="variationReason"
          maxLength={250}
          value={variationReason}
          requiredText="Please enter a reason"
          label="Variation reason"
          placeholder="Write a reason for the variation..."
          required={true}
          register={register}
          onChange={(event) => setVariationReason(event.target.value)}
          error={errors && errors.variationReason}
        />
        <PrimarySubmitButton label="Next" />
      </form>
    </>
  )
}

WorkOrderUpdateForm.propTypes = {
  latestTasks: PropTypes.array.isRequired,
  originalTasks: PropTypes.array.isRequired,
  addedTasks: PropTypes.array.isRequired,
  propertyReference: PropTypes.string.isRequired,
  onGetToSummary: PropTypes.func.isRequired,
  setVariationReason: PropTypes.func.isRequired,
  variationReason: PropTypes.string.isRequired,
}

export default WorkOrderUpdateForm
