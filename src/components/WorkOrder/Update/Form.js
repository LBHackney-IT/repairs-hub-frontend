import PropTypes from 'prop-types'
import { PrimarySubmitButton, TextArea } from '../../Form'
import { useForm } from 'react-hook-form'
import OriginalRateScheduleItems from '../RateScheduleItems/OriginalRateScheduleItems'
import LatestRateScheduleItems from '../RateScheduleItems/LatestRateScheduleItems'
import AddedRateScheduleItems from '../RateScheduleItems/AddedRateScheduleItems'

const WorkOrderUpdateForm = ({
  sorCodes,
  latestTasks,
  originalTasks,
  addedTasks,
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
          sorCodes={sorCodes}
          register={register}
          errors={errors}
          addedTasks={addedTasks}
          isContractorUpdatePage={isContractorUpdatePage}
        />
        <TextArea
          name="variationReason"
          value={variationReason}
          label="Variation reason"
          placeholder="Write a reason for the variation..."
          required={true}
          onChange={(event) => setVariationReason(event.target.value)}
          register={register({
            required: 'Please enter a reason',
          })}
          error={errors && errors.variationReason}
        />
        <PrimarySubmitButton label="Next" />
      </form>
    </>
  )
}

WorkOrderUpdateForm.propTypes = {
  sorCodes: PropTypes.array.isRequired,
  latestTasks: PropTypes.array.isRequired,
  originalTasks: PropTypes.array.isRequired,
  addedTasks: PropTypes.array.isRequired,
  onGetToSummary: PropTypes.func.isRequired,
  setVariationReason: PropTypes.func.isRequired,
  variationReason: PropTypes.string.isRequired,
}

export default WorkOrderUpdateForm
