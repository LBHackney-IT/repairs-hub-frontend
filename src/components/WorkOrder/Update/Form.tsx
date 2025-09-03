import {
  PrimarySubmitButton,
  TextArea,
  CharacterCountLimitedTextArea,
} from '../../Form'
import { useForm } from 'react-hook-form'
import OriginalRateScheduleItems from '../RateScheduleItems/OriginalRateScheduleItems'
import LatestRateScheduleItems from '../RateScheduleItems/LatestRateScheduleItems'
import AddedRateScheduleItems from '../RateScheduleItems/AddedRateScheduleItems'
import SorCode from '@/root/src/models/sorCode'
import { Dispatch, SetStateAction } from 'react'
import Contractor from '@/root/src/models/contractor'

interface Props {
  latestTasks: SorCode[]
  originalTasks: SorCode[]
  addedTasks: SorCode[]
  onGetToSummary: (e: any) => void
  setVariationReason: Dispatch<SetStateAction<string>>
  sorSearchRequest?: (searchText: any) => Promise<any>
  variationReason: string
  contractorReference: string
  sorCodeArrays: SorCode[][]
  setSorCodeArrays: Dispatch<SetStateAction<SorCode[][]>>
  formState?: any // its not actually passed, so I will leave it
  setPageToMultipleSORs: (formState: any) => void
  contractor: Contractor
}

const WorkOrderUpdateForm = (props: Props) => {
  const {
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
    contractor,
  } = props

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
          // setValue={setValue}
          setPageToMultipleSORs={() => {
            setPageToMultipleSORs(getValues())
          }}
        />
        {contractor?.multiTradeEnabled ? (
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

export default WorkOrderUpdateForm
