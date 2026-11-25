import { TextArea, PrimarySubmitButton, Checkbox } from '../../Form'
import { useForm } from 'react-hook-form'
import { Dispatch, SetStateAction, useState } from 'react'
import Spinner from '@/components/Spinner'
import WarningInfoBox from '../../Template/WarningInfoBox'
import {
  SorCodeError,
  SorCodeValidator,
  SorCodeValidationCallback,
  ValidatedSorCode,
} from '@/utils/helpers/SorCodeValidator'

type FormValues = {
  newSorCodes: string
  preserveDuplicates: boolean
}

const parseSorCodes = (input: string): string[] =>
  input
    .split('\n')
    .map((code) => code.trim())
    .filter(Boolean)

interface Props {
  currentSorCodes: string[]
  setPageBackToFormView: () => void
  sorExistenceValidationCallback: SorCodeValidationCallback
  setSorCodesFromBatchUpload: (sorCodes: ValidatedSorCode[]) => void
  setAnnouncementMessage: Dispatch<SetStateAction<string>>
  setIsPriorityEnabled: Dispatch<SetStateAction<boolean>>
}

const AddMultipleSORs = (props: Props) => {
  const {
    currentSorCodes,
    setPageBackToFormView,
    sorExistenceValidationCallback,
    setSorCodesFromBatchUpload,
    setAnnouncementMessage,
    setIsPriorityEnabled,
  } = props

  const { register, handleSubmit, errors } = useForm<FormValues>()

  const [validationErrors, setValidationErrors] = useState<SorCodeError[]>([])

  const [performingValidation, setPerformingValidation] = useState(false)

  const validateAndSubmit = async (
    sorCodesToValidate: string[],
    preserveDuplicates: boolean
  ) => {
    const validator = new SorCodeValidator({
      preserveDuplicates,
      currentSorCodes,
      sorCodesToValidate,
      additionalValidationCallback: sorExistenceValidationCallback,
    })

    await validator.validate()

    if (validator.errors.length > 0) {
      setValidationErrors(validator.errors)
      return
    }

    setAnnouncementMessage(
      validator.duplicateCodes.length > 0
        ? 'Duplicate SOR codes have been removed'
        : ''
    )
    setSorCodesFromBatchUpload(validator.validatedCodeSet)
    setIsPriorityEnabled(true)
    setPageBackToFormView()
  }

  const onSubmit = async ({ newSorCodes, preserveDuplicates }: FormValues) => {
    setPerformingValidation(true)

    const strippedCodes = parseSorCodes(newSorCodes)

    if (strippedCodes.length === 0) {
      setValidationErrors([])
    } else {
      await validateAndSubmit(strippedCodes, !!preserveDuplicates)
    }

    setPerformingValidation(false)
  }

  return (
    <>
      <a
        className="govuk-back-link lbh-back-link govuk-!-display-none-print"
        role="button"
        onClick={() => {
          setSorCodesFromBatchUpload([])
          setPageBackToFormView()
        }}
      >
        Back
      </a>

      <h1 className="lbh-heading-h1 govuk-!-margin-bottom-2">
        Add multiple SOR codes
      </h1>

      <form
        role="form"
        id="adding-multiple-sors-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextArea
          name="newSorCodes"
          label="Enter SOR codes as a list:"
          register={register({
            required: 'Please enter SOR codes',
          })}
          error={errors && errors.newSorCodes}
          rows={6}
          placeholder="04500910&#10;49PLMAT2&#10;RTR03016"
        />

        <div className="govuk-checkboxes lbh-checkboxes govuk-!-margin-bottom-4">
          <Checkbox
            name="preserveDuplicates"
            label="Keep duplicate SOR codes"
            hintText="By default, repeated codes and codes already on this work order are removed. Tick this to keep them."
            register={register}
          />
        </div>

        {validationErrors.length > 0 && (
          <WarningInfoBox
            header={`Invalid SOR code(s) entered: ${validationErrors
              .map((error) => `"${error.code}"`)
              .join(' ')}`}
            text=""
          />
        )}

        <PrimarySubmitButton
          label="Submit"
          {...(performingValidation && { disabled: true })}
        />

        {performingValidation && <Spinner />}
      </form>
    </>
  )
}

export default AddMultipleSORs
