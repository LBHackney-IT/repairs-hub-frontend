import { useEffect, useState } from 'react'
import { Checkbox } from '../../../Form'
import Radios from '../../../Form/Radios'

interface Props {
  register: any
  watch: any
  errors: { [key: string]: { message: string } }
}

const RADIO_OPTIONS = [
  { text: 'Yes', value: 'true' },
  { text: 'No', value: 'false' },
]

export const RaiseWorkOrderAwaabs = (props: Props) => {
  const { register, errors, watch } = props

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
}) => {
  const { visible, register } = props

  if (!visible) return

  return (
    <div>
      <fieldset className="govuk-fieldset govuk-!-margin-bottom-2 govuk-!-padding-2 lbh-fieldset">
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--s govuk-!-padding-top-3">
          What is the reason for this Awaab's Repair?
        </legend>

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
              register={register()}
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
