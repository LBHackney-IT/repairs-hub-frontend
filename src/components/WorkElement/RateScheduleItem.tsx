import { useState } from 'react'
import ErrorMessage from '../Errors/ErrorMessage'
import { DataList, TextInput } from '../Form'
import { useRouter } from 'next/router'
import SorCode from '@/root/src/models/sorCode'

type SorSearchRequest = (searchText: string) => Promise<SorCode[]>

interface Props {
  sorCodes: SorCode[]
  register: any
  errors: any
  index?: number
  showRemoveRateScheduleItem: boolean
  removeRateScheduleItem?: (index: number) => void
  code?: string
  quantity?: number
  description?: string
  cost?: number
  disabled?: boolean
  onQuantityChange?: (index: number, event: any) => void
  onRateScheduleItemChange?: (index: number, code?: string) => void
  setSorCodes?: (sorCodes: SorCode[]) => void
  sorSearchRequest?: false | SorSearchRequest
}

const RateScheduleItem = ({
  onRateScheduleItemChange,
  sorCodes,
  register,
  errors,
  index,
  showRemoveRateScheduleItem,
  removeRateScheduleItem,
  code,
  quantity,
  disabled,
  onQuantityChange,
  description,
  cost,
  setSorCodes,
  sorSearchRequest,
}: Props) => {
  const router = useRouter()
  const onRaiseRepairPage = () =>
    router.pathname === '/properties/[id]/raise-repair/new'
  const sorOptions = sorCodes.map((sor) =>
    onRaiseRepairPage()
      ? `${sor.code} - ${sor.shortDescription} - £${sor.cost}`
      : `${sor.code} - ${sor.shortDescription}`
  )

  const sorCodesWithOptions = sorCodes.map((sor, index) => ({
    ...sor,
    optionText: sorOptions[index],
  }))

  const [sorDescription, setSorDescription] = useState(description || '')
  const [sorCost, setSorCost] = useState<number | ''>(cost || '')
  const [sorCodesError, setSorCodesError] = useState<string | null>()

  let sorCodeSelectDebounceTimeout: ReturnType<typeof setTimeout>

  const sorSearch = (textValue: string) => {
    if (textValue.length < 3 && sorCodes.length > 0) {
      setSorCodes([])
    }

    clearTimeout(sorCodeSelectDebounceTimeout)

    if (textValue.length >= 3 && sorCodes.length === 0) {
      sorCodeSelectDebounceTimeout = setTimeout(() => {
        setSorCodesError(null)
        const searchRequest = sorSearchRequest as SorSearchRequest

        searchRequest(textValue)
          .then((sorCodes) => {
            setSorCodes(sorCodes)
          })
          .catch((e) => {
            setSorCodes([])
            console.error('An error has occured:', e.response)
            setSorCodesError(
              `Oops an error occurred getting SOR codes with error status: ${e.response?.status}`
            )
          })
      }, 500)
    }
  }

  const onSorInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const textValue = event.target.value

    const sorCode = sorCodesWithOptions.find(
      (code) => code.optionText === textValue
    )

    if (sorCode) {
      setSorDescription(sorCode.shortDescription)
      setSorCost(sorCode.cost)
    }

    onRateScheduleItemChange && onRateScheduleItemChange(index, sorCode?.code)
    sorSearchRequest && sorSearch(textValue)
  }

  return (
    <>
      <div className="rate-schedule-item govuk-!-margin-top-0">
        <div className="rate-schedule-item__fields">
          <DataList
            name={`rateScheduleItems[${index}][code]`}
            label="SOR Code"
            labelMessage="- Search by code or description"
            options={sorOptions}
            defaultValue={code ?? ''}
            disabled={disabled}
            onChange={onSorInputChange}
            required={true}
            register={register({
              required: 'Please select an SOR code',
              validate: (value) => {
                if (typeof sorSearchRequest !== 'function') {
                  // normal validation
                  return (
                    sorOptions.some((text) => text === value) ||
                    'SOR code is not valid'
                  )
                }

                const extractedSorCode = value.split(' ')[0]

                // This logic works by comparing the selected sorCode with the list provided for the dropdown
                // however, due to incremental search, there are no sorCodes to manually compare this sorCode with.
                // Therefore, if incremental search used (sorSearchRequest is a function, and not false),
                // we can send a request for this specific sor, and see if it exists
                sorSearchRequest(extractedSorCode)
                  .then((response) => {
                    if (response.length === 0) return 'SOR code is not valid'
                    return (
                      response.some((x) => x.code === extractedSorCode) ||
                      'SOR code is not valid'
                    )
                  })
                  .catch((e) => {
                    return `Oops an error occurred getting SOR codes with error status: ${e.response?.status}`
                  })
              },
            })}
            hint={
              sorSearchRequest
                ? 'Enter three characters to view results'
                : undefined
            }
            error={errors && errors.rateScheduleItems?.[`${index}`]?.code}
            widthClass="govuk-!-margin-top-0 govuk-!-width-full"
            additionalDivClasses="rate-schedule-item--sor-code"
            children={undefined}
            value={undefined}
            maxLength={undefined}
            remainingCharacterCount={undefined}
          />

          <input
            id={`rateScheduleItems[${index}][description]`}
            name={`rateScheduleItems[${index}][description]`}
            value={sorDescription}
            type="hidden"
            ref={register}
          />

          <input
            id={`rateScheduleItems[${index}][cost]`}
            name={`rateScheduleItems[${index}][cost]`}
            value={sorCost}
            type="hidden"
            ref={register}
          />

          <TextInput
            name={`rateScheduleItems[${index}][quantity]`}
            label="Quantity"
            error={errors && errors.rateScheduleItems?.[`${index}`]?.quantity}
            widthClass="govuk-!-width-full"
            required={true}
            defaultValue={quantity ?? ''}
            additionalDivClasses="rate-schedule-item--quantity"
            onChange={(event) =>
              onQuantityChange && onQuantityChange(index, event)
            }
            disabled={disabled}
            register={register({
              required: 'Please enter a quantity',
              validate: (value) => {
                const maxTwoDecimalPoints = /^(?=.*\d)\d*(?:\.\d{1,2})?$/
                if (isNaN(value)) {
                  return 'Quantity must be a number'
                } else if (value <= 0) {
                  return 'Quantity must be greater than 0'
                } else if (!maxTwoDecimalPoints.test(value)) {
                  return 'Quantity including a decimal point is permitted a maximum of 2 decimal places'
                } else {
                  return true
                }
              },
            })}
          />
          {/* always rendered so quantity lines up on rows without a remove button */}
          <div className="remove-rate-schedule-item">
            {showRemoveRateScheduleItem && (
              <button
                id={`remove-rate-schedule-item-${index}`}
                className="lbh-link"
                type="button"
                onClick={() => removeRateScheduleItem(index)}
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {sorCodesError && <ErrorMessage label={sorCodesError} />}
      </div>
    </>
  )
}

export default RateScheduleItem
