import { TextArea, PrimarySubmitButton } from '../../Form'
import { useForm } from 'react-hook-form'
import { SorCodeValidator } from '@/utils/helpers/SorCodeValidator'
import { Dispatch, SetStateAction, useState } from 'react'
import Spinner from '@/components/Spinner'
import WarningInfoBox from '../../Template/WarningInfoBox'

interface Props {
  currentSorCodes: any[]
  setPageBackToFormView: () => void
  sorExistenceValidationCallback: any
  setSorCodesFromBatchUpload: (sorCodes: any) => void
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

  const { register, handleSubmit, errors } = useForm()

  const [validationErrors, setValidationErrors] = useState([])

  const [performingValidation, setPerformingValidation] = useState(false)

  const onSubmit = async ({ newSorCodes }) => {
    setPerformingValidation(true)

    const strippedCodes = newSorCodes
      .split('\n')
      .map((code) => code.trim())
      .filter((x) => x)

    if (strippedCodes.length > 0) {
      const validator = new SorCodeValidator({
        currentSorCodes,
        sorCodesToValidate: strippedCodes,
        additionalValidationCallback: sorExistenceValidationCallback,
      })

      await validator.validate()

      if (validator.errors.length > 0) {
        setValidationErrors(validator.errors)
      } else {
        validator.duplicateCodes.length > 0
          ? setAnnouncementMessage('Duplicate SOR codes have been removed')
          : setAnnouncementMessage('')

        setSorCodesFromBatchUpload(validator.validatedCodeSet)
        if (newSorCodes.length > 0) {
          setIsPriorityEnabled(true)
        }
        setPageBackToFormView()
      }
    } else {
      setValidationErrors([])
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
