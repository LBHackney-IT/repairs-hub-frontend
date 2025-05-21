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
import { MULTITRADE_ENABLED_CONTRACTORS } from '@/utils/constants'

const WorkOrderUpdateForm = ({
  latestTasks,
  originalTasks,
  addedTasks,
  onGetToSummary,
  setVariationReason,
  variationReason,
  contractorReference,
  sorSearchRequest,
  sorCodeArrays,
  setSorCodeArrays,
  formState,
  setPageToMultipleSORs,
}) => {
  const { register, handleSubmit, errors, setValue, getValues } = useForm({
    defaultValues: { ...formState },
  })
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
          sorSearchRequest={sorSearchRequest}
          sorCodeArrays={sorCodeArrays}
          setSorCodeArrays={setSorCodeArrays}
          setValue={setValue}
          setPageToMultipleSORs={() => {
            setPageToMultipleSORs(getValues())
          }}
        />
        {MULTITRADE_ENABLED_CONTRACTORS.includes(contractorReference) ? (
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
  latestTasks: PropTypes.array.isRequired,
  originalTasks: PropTypes.array.isRequired,
  addedTasks: PropTypes.array.isRequired,
  onGetToSummary: PropTypes.func.isRequired,
  setVariationReason: PropTypes.func.isRequired,
  sorSearchRequest: PropTypes.func,
  variationReason: PropTypes.string.isRequired,
  contractorReference: PropTypes.string.isRequired,
  sorCodeArrays: PropTypes.array.isRequired,
  setSorCodeArrays: PropTypes.func.isRequired,
}

export default WorkOrderUpdateForm
