import PropTypes from 'prop-types'
import { PrimarySubmitButton, CharacterCountLimitedTextArea } from '../Form'
import { useForm } from 'react-hook-form'
import OriginalRateScheduleItems from './RateScheduleItems/OriginalRateScheduleItems'
import ExistingRateScheduleItems from './RateScheduleItems/ExistingRateScheduleItems'
import VariedRateScheduleItems from './RateScheduleItems/VariedRateScheduleItems'

const UpdateJobForm = ({
  tasks,
  propertyReference,
  onGetToSummary,
  addedTasks,
  setVariationReason,
  variationReason,
}) => {
  const { register, handleSubmit, errors } = useForm()
  const isContractorUpdatePage = true
  const originalTasks = tasks.filter((t) => t.original)

  return (
    <>
      <form
        role="form"
        id="repair-request-form"
        onSubmit={handleSubmit(onGetToSummary)}
      >
        <OriginalRateScheduleItems originalTasks={originalTasks} />
        <ExistingRateScheduleItems
          tasks={tasks}
          register={register}
          errors={errors}
        />
        <VariedRateScheduleItems
          register={register}
          errors={errors}
          addedTasks={addedTasks}
          isContractorUpdatePage={isContractorUpdatePage}
          propertyReference={propertyReference}
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

UpdateJobForm.propTypes = {
  tasks: PropTypes.array.isRequired,
  propertyReference: PropTypes.string.isRequired,
  onGetToSummary: PropTypes.func.isRequired,
  addedTasks: PropTypes.array.isRequired,
  setVariationReason: PropTypes.func.isRequired,
  variationReason: PropTypes.string.isRequired,
}

export default UpdateJobForm
