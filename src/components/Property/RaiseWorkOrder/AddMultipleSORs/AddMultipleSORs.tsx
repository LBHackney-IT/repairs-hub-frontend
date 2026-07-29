import { TextArea, PrimarySubmitButton } from '../../../Form'
import { useForm } from 'react-hook-form'
import WarningInfoBox from '../../../Template/WarningInfoBox'
import { useAddMultipleSORs } from './useAddMultipleSORs'
import SpinnerWithLabel from '../../../SpinnerWithLabel'
import SorCode from '@/root/src/models/sorCode'
import { useEffect, useState } from 'react'

interface Props {
  setPageBackToFormView: () => void
  sorExistenceValidationCallback: (
    sorCodes: string[]
  ) => Promise<{
    allCodesValid: boolean
    validCodes: SorCode[]
    invalidCodes: SorCode[]
  }>
  onSubmitAddMultipleSorCodes: (sorCodes: SorCodeWithQuantity[]) => void
}

export interface SorCodeWithQuantity extends SorCode {
  quantity: string
}

const AddMultipleSORs = (props: Props) => {
  const {
    setPageBackToFormView,
    sorExistenceValidationCallback,
    onSubmitAddMultipleSorCodes,
  } = props

  const { register, handleSubmit, errors } = useForm()

  const {
    validationErrors,
    setValidationErrors,
    isLoading,
    setIsLoading,
    extractSorCodes,
    findDuplicateSorCodes,
  } = useAddMultipleSORs()

  //   554410585 4
  // 554410585 2
  // 554410523

  const parseAndValidateCodes = async (
    textInput: string
  ): Promise<SorCodeWithQuantity[] | null> => {
    const extractedSorCodeData = extractSorCodes(textInput)

    if (extractedSorCodeData.length === 0) {
      setValidationErrors(["You haven't included any codes"])
      return null
    }

    const duplicateCodes = findDuplicateSorCodes(extractedSorCodeData)
    if (duplicateCodes.length >= 1) {
      setValidationErrors([
        `Duplicate SOR codes found: ${duplicateCodes.join(', ')}`,
      ])
      return null
    }

    const validationResult = await sorExistenceValidationCallback(
      extractedSorCodeData.map((x) => x.code)
    )

    if (validationResult?.invalidCodes.length >= 1) {
      setValidationErrors([
        `The following codes are invalid: ${validationResult?.invalidCodes.join(
          ', '
        )}`,
      ])
      return null
    }

    // is success

    const sorCodeQuantity: { [key: string]: string } = {}
    extractedSorCodeData.forEach((x) => {
      sorCodeQuantity[x.code] = x.quantity
    })

    return validationResult.validCodes.map((x) => {
      return {
        ...x,
        quantity: sorCodeQuantity[x.code],
      }
    })
  }

  const [validSorCodes, setValidSorCodes] = useState<
    SorCodeWithQuantity[] | null
  >(null)
  const [textInput, setTextInput] = useState<string>('')

  useEffect(() => {
    if (textInput.trim() === '') return

    handleNewInput(textInput)
  }, [textInput])

  const handleNewInput = async (textInput: string) => {
    // if (isLoading) return

    setIsLoading(true)
    setValidationErrors([])
    setValidSorCodes(null)

    setTimeout(async () => {

      const sorCodes = await parseAndValidateCodes(textInput)
      setIsLoading(false)

      if (sorCodes === null) return
    
      setValidSorCodes(sorCodes)
    }, 1000)
  }

  const onSubmit = async () => {
    if (isLoading) return
    if (validSorCodes === null) return

    onSubmitAddMultipleSorCodes(validSorCodes)
    setPageBackToFormView()
  }

  return (
    <>
      <a
        className="govuk-back-link lbh-back-link govuk-!-display-none-print"
        role="button"
        onClick={() => setPageBackToFormView()}
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
          hint="Optionally include a quantity value at the end (EG 'CODE 8')"
          register={register({
            required: 'Please enter SOR codes',
          })}
          error={errors && errors.newSorCodes}
          rows={6}
          placeholder="04500910 5&#10;49PLMAT2&#10;RTR03016"
          value={textInput}
          onInput={(e) => setTextInput(e.target.value)}
        />

        {validationErrors.length > 0 && (
          <WarningInfoBox
            className="variant-error"
            header="Validation error"
            text={`${validationErrors.join(' ')}`}
          />
        )}

       {validSorCodes?.length >= 1 && (
         <WarningInfoBox
            header="SOR Codes Found"
            text={`Successfully validated ${validSorCodes?.length} codes`}
          />
       )}

        {isLoading && (
          <div>
            <SpinnerWithLabel label="Extracting and validating codes..." />
          </div>
        )}

        <PrimarySubmitButton
          label="Add SOR Codes"
          disabled={isLoading || validSorCodes === null}
          style={{
            marginTop: '0',
          }}
        />
      </form>
    </>
  )
}

export default AddMultipleSORs
