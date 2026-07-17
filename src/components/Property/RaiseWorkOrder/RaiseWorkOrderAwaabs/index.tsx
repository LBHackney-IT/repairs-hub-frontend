import { useEffect, useState } from 'react'
import { Checkbox } from '../../../Form'
import Radios from '../../../Form/Radios'
import ErrorMessage from '../../../Errors/ErrorMessage'

interface Props {
  register: any
  watch: any
  errors: { [key: string]: { message: string } }
  clearErrors: any
  setError: any
  getValues: any
}

const RADIO_OPTIONS = [
  { text: 'Yes', value: 'true' },
  { text: 'No', value: 'false' },
]

export const RaiseWorkOrderAwaabs = (props: Props) => {
  const { register, errors, watch, getValues, setError, clearErrors } = props

  const [showAdditionalOptions, setShowAdditionalOptions] = useState<boolean>(
    false
  )

  const isAwaabsLawRepairWatchedValue = watch('isAwaabsLawRepair')

  useEffect(() => {
    console.log('watch', { isAwaabsLawRepairWatchedValue })

    setShowAdditionalOptions(() => isAwaabsLawRepairWatchedValue == 'true')
  }, [isAwaabsLawRepairWatchedValue])

  return (
    <div
      style={{
        background: '#f9f9f9',
        padding: '15px',
      }}
    >
      <Radios
        name="isAwaabsLawRepair"
        label="Is this Repair related to Awaab's law?"
        hint="Was the cause of this repair related to Awaabs?"
        register={register({
          required: 'Please select an option',
        })}
        error={errors && errors.isAwaabsLawRepair}
        options={RADIO_OPTIONS.map((x) => ({
          ...x,
          children:
            x.value === 'true' ? (
              <RaiseWorkOrderAwaabsAdditionalOptions
                register={register}
                visible={showAdditionalOptions}
                isAnAwaabsRepairSelected={showAdditionalOptions}
                clearErrors={clearErrors}
                setError={setError}
                getValues={getValues}
                errors={errors}
              />
            ) : null,
        }))}
      />
    </div>
  )
}

const AWAABS_ADDITIONAL_OPTIONS: {
  name: string
  label: string
  hint: string
}[] = [
  {
    name: 'isAwaabsDampAndMouldRepair',
    label: 'Damp & Mould',
    hint: 'This repair was caused by damp and mould',
  },
]

const RaiseWorkOrderAwaabsAdditionalOptions = (props: {
  visible: boolean
  register: any
  isAnAwaabsRepairSelected: boolean
  clearErrors: any
  setError: any
  getValues: any
  errors: { [key: string]: { message: string } }
}) => {
  const {
    visible,
    register,
    isAnAwaabsRepairSelected,
    clearErrors,
    setError,
    getValues,
    errors,
  } = props

  const validateAtLeastOneOptionSelected = () => {
    if (!isAnAwaabsRepairSelected) {
      clearErrors('typeOfAwaabsWork')
      return
    }

    const isAnyChecked =
      AWAABS_ADDITIONAL_OPTIONS.filter((x) => getValues(x.name) === true)
        .length >= 1

    if (!isAnyChecked) {
      setError('typeOfAwaabsWork', {
        type: 'manual',
        message: 'Please select at least one reason',
      })
      return
    }

    clearErrors('typeOfAwaabsWork')
  }

  if (!visible) return

  return (
    <div>
      <fieldset className="govuk-fieldset govuk-!-margin-bottom-2 govuk-!-padding-2 lbh-fieldset">
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--s govuk-!-padding-top-3">
          What is the reason for this Awaab&apos;s Repair?
        </legend>

        {/* <p>checked: {isAnyChecked ? "TRUE" : "FALSE"}</p> */}

        {errors.typeOfAwaabsWork && (
          <div style={{ marginTop: 0, marginBlock: 10 }}>
            <ErrorMessage label={errors.typeOfAwaabsWork.message} />
          </div>
        )}

        <div
          className="govuk-checkboxes govuk-checkboxes--small govuk-!-margin-top-1 lbh-checkboxes"
          id="contractor-filters"
        >
          {AWAABS_ADDITIONAL_OPTIONS.map((x) => (
            <Checkbox
              // checked={false}
              hintText={x.hint}
              label={x.label}
              name={x.name}
              key={x.name}
              register={register({
                validate: () => {
                  validateAtLeastOneOptionSelected()
                },
              })}
              error={undefined}
              className="govuk-!-margin-0"
              labelClassName="lbh-body-xs govuk-!-margin-0 checkbox-negative-margin"
            />
          ))}
        </div>
      </fieldset>
    </div>
  )
}
