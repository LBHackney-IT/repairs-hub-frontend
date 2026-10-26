import { PrimarySubmitButton } from '../../Form'
import SorCodeEditor from './SorCodeEditor'
import { useForm } from 'react-hook-form'
import { SorCodeValidator } from '@/utils/helpers/SorCodeValidator'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  describeLineNumbers,
  parseSorCodeLines,
  SorCodeLineError,
} from '@/utils/helpers/parseSorCodeLines'
import Spinner from '@/components/Spinner'

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

  const { register, handleSubmit, setValue, errors } = useForm()

  const [sorCodesText, setSorCodesText] = useState('')

  useEffect(() => {
    register(
      { name: 'newSorCodes' },
      {
        validate: (value) => Boolean(value?.trim()) || 'Please enter SOR codes',
      }
    )
  }, [register])

  const onSorCodesTextChange = (text: string) => {
    setSorCodesText(text)
    setValue('newSorCodes', text, { shouldValidate: true })
  }

  // Errors from the existence check, which is only requested on submit
  const [existenceErrors, setExistenceErrors] = useState<SorCodeLineError[]>([])
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [requestError, setRequestError] = useState<string>(null)

  // move focus to the field after a failed submit so the errors are read out
  const [failedSubmitCount, setFailedSubmitCount] = useState(0)
  useEffect(() => {
    if (failedSubmitCount > 0) document.getElementById('newSorCodes')?.focus()
  }, [failedSubmitCount])

  // Nothing is flagged until the first submit. After that the errors are
  // re-derived from the text so they stay in step with edits; existence errors
  // are kept only while the line they belong to is unchanged.
  const currentLines = sorCodesText.split('\n').map((line) => line.trim())
  const validationErrors = [
    ...parseSorCodeLines(sorCodesText, { currentSorCodes }).errors,
    ...existenceErrors.filter(
      (error) => currentLines[error.lineNumber - 1] === error.text
    ),
  ]

  const invalidLines = new Set<number>(
    hasSubmitted ? validationErrors.flatMap((error) => error.lineNumbers) : []
  )

  const [performingValidation, setPerformingValidation] = useState(false)

  const onSubmit = async ({ newSorCodes }) => {
    setHasSubmitted(true)
    setRequestError(null)

    const { lines, errors: lineErrors } = parseSorCodeLines(newSorCodes, {
      currentSorCodes,
    })

    // don't make a request until the local checks pass
    if (lineErrors.length > 0 || lines.length === 0) {
      setExistenceErrors([])
      setFailedSubmitCount((count) => count + 1)
      return
    }

    setPerformingValidation(true)

    const validator = new SorCodeValidator({
      sorCodesToValidate: lines.map((line) => line.code),
      additionalValidationCallback: sorExistenceValidationCallback,
    })

    try {
      await validator.validate()
    } catch (e) {
      console.error('Failed to check SOR codes exist', e)
      setRequestError('Unable to check the SOR codes, please try again')
      setFailedSubmitCount((count) => count + 1)
      setPerformingValidation(false)
      return
    }

    if (validator.errors.length > 0) {
      setExistenceErrors(
        validator.errors.map(({ code, message }) => {
          const { lineNumber, text } = lines.find((line) => line.code === code)
          return { lineNumber, lineNumbers: [lineNumber], text, message }
        })
      )
      setFailedSubmitCount((count) => count + 1)
    } else {
      setAnnouncementMessage('')
      setSorCodesFromBatchUpload(
        validator.validatedCodeSet.map((sor) => ({
          ...sor,
          quantity: lines.find((line) => line.code === sor.code).quantity,
        }))
      )
      setIsPriorityEnabled(true)
      setPageBackToFormView()
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
        <SorCodeEditor
          name="newSorCodes"
          label="Enter SOR codes as a list:"
          hint="Add a whole number quantity after a code if needed, for example 04500910 3. Quantity defaults to 1."
          value={sorCodesText}
          onValueChange={onSorCodesTextChange}
          invalidLines={invalidLines}
          error={
            requestError
              ? { message: requestError }
              : hasSubmitted && validationErrors.length > 0
              ? {
                  message: (
                    <span className="sor-code-editor-errors">
                      <span className="sor-code-editor-errors__heading">
                        Please correct the highlighted lines
                      </span>
                      {validationErrors.map((error) => (
                        <span
                          key={`${error.lineNumber}-${error.message}`}
                          className="sor-code-editor-errors__item"
                        >
                          <span className="sor-code-editor-errors__line">
                            {describeLineNumbers(error.lineNumbers)}:
                          </span>{' '}
                          <span className="sor-code-editor-errors__text">
                            {error.text}
                          </span>{' '}
                          {error.message}
                        </span>
                      ))}
                    </span>
                  ),
                }
              : errors && errors.newSorCodes
          }
          placeholder={'04500910 3\n49PLMAT2\nRTR03016 2'}
        />

        <PrimarySubmitButton
          label="Add SOR codes"
          {...(performingValidation && { disabled: true })}
        />

        {performingValidation && <Spinner />}
      </form>
    </>
  )
}

export default AddMultipleSORs
