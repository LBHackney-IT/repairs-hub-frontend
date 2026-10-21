import { Select } from '../../../Form'

interface Props {
  register: any
  errors: { [key: string]: { message: string } }
}

const SELECT_OPTIONS = [
  { text: 'Damp & Mould', value: 'damp-and-mould' },
  { text: 'Excess cold', value: 'excess-cold' },
  { text: 'Excess heat', value: 'excess-heat' },
  { text: 'Falls on the level', value: 'falls-on-the-level' },
  { text: 'Falling on stairs', value: 'falling-on-stairs' },
  { text: 'Falling between levels', value: 'falling-between-levels' },
  {
    text: 'Structural collapse and falling elements',
    value: 'structural-collapse-and-falling-elements',
  },
  { text: 'Fire and explosions', value: 'fire-and-explosions' },
  { text: 'Electrical hazards', value: 'electrical-hazards' },
  { text: 'Domestic hygiene', value: 'domestic-hygiene' },
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
