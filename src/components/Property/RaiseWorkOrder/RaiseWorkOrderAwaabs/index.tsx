import { useEffect, useState } from 'react'
import Radios from '../../../Form/Radios'
import { RaiseWorkOrderAwaabsAdditionalOptions } from './RaiseWorkOrderAwaabsAdditionalOptions'

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
        hint="Was the cause of this repair related to Awaabs's law?"
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
