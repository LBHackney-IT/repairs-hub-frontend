import { Select } from '../../../Form'

interface Props {
  register: any
  errors: { [key: string]: { message: string } }
}

const SELECT_OPTIONS = [
  { text: 'Damp & Mould', value: 'damp-and-mould' },
  { text: 'None of the above', value: 'none-of-the-above' },
]

export const RaiseWorkOrderReasonForRepair = (props: Props) => {
  const { register, errors } = props

  return (
    <Select
      name="reasonForRepair"
      label="Reason for this repair"
      hint="Is the repair related to the following?"
      options={SELECT_OPTIONS}
      required={true}
      register={register({
        required: 'Please select an option',
      })}
      error={errors && errors.reasonForRepair}
      widthClass="govuk-!-width-full"
      children={undefined}
      ignoreValue={undefined}
      defaultValue={undefined}
      value={undefined}
      onChange={undefined}
      disabled={undefined}
    />
  )
}
