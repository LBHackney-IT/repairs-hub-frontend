import PropTypes from 'prop-types'
import {
  PrimarySubmitButton,
  TextArea,
  CharacterCountLimitedTextArea,
} from '../../Form'
import { useForm } from 'react-hook-form'
import OriginalRateScheduleItems from '../RateScheduleItems/OriginalRateScheduleItems'
import LatestRateScheduleItems from '../RateScheduleItems/LatestRateScheduleItems'
import AddedRateScheduleItems from '../RateScheduleItems/AddedRateScheduleItems'
import { PURDY_CONTRACTOR_REFERENCE } from '@/utils/constants'

const WorkOrderUpdateForm = ({
  sorCodes,
  latestTasks,
  originalTasks,
  addedTasks,
  onGetToSummary,
  setVariationReason,
  variationReason,
  contractorReference,
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
        {contractorReference === PURDY_CONTRACTOR_REFERENCE ? (
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
        ) : (
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
        )}
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
  contractorReference: PropTypes.string.isRequired,
}

export default WorkOrderUpdateForm
