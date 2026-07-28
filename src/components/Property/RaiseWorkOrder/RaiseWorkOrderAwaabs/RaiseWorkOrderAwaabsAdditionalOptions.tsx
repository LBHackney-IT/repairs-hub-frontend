import { Checkbox } from '../../../Form'
import ErrorMessage from '../../../Errors/ErrorMessage'

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

interface Props {
  visible: boolean
  register: any
  isAnAwaabsRepairSelected: boolean
  clearErrors: any
  setError: any
  getValues: any
  errors: { [key: string]: { message: string } }
}

export const RaiseWorkOrderAwaabsAdditionalOptions = (props: Props) => {
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
