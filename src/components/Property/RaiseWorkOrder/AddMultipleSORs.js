import PropTypes from 'prop-types'
import { TextArea, PrimarySubmitButton } from '../../Form'
import { useForm } from 'react-hook-form'
import { SorCodeValidator } from '@/utils/helpers/SorCodeValidator'
import { useState } from 'react'
import Spinner from '@/components/Spinner'

const AddMultipleSORs = ({
  currentSorCodes,
  setPageBackToFormView,
  sorExistenceValidationCallback,
  setSorCodesFromBatchUpload,
  setAnnouncementMessage,
  setIsPriorityEnabled,
}) => {
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

  const renderErrorSummary = (errors) => (
    <div
      class="govuk-error-summary optional-extra-class lbh-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
      tabindex="-1"
      data-module="govuk-error-summary"
    >
      <h2 class="govuk-error-summary__title" id="error-summary-title">
        Invalid SOR codes entered
      </h2>
      <div class="govuk-error-summary__body">
        <ul class="govuk-list govuk-error-summary__list">
          {errors.map((error, i) => (
            <li key={i}>{`${error.code}: ${error.message}`}</li>
          ))}
        </ul>
      </div>
    </div>
  )

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

      {validationErrors.length > 0 && renderErrorSummary(validationErrors)}

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

        <PrimarySubmitButton
          label="Submit"
          {...(performingValidation && { disabled: true })}
        />

        {performingValidation && <Spinner />}
      </form>
    </>
  )
}

AddMultipleSORs.propTypes = {
  currentSorCodes: PropTypes.array.isRequired,
  setPageBackToFormView: PropTypes.func.isRequired,
  sorExistenceValidationCallback: PropTypes.func.isRequired,
  setSorCodesFromBatchUpload: PropTypes.func.isRequired,
  setAnnouncementMessage: PropTypes.func.isRequired,
}

export default AddMultipleSORs
