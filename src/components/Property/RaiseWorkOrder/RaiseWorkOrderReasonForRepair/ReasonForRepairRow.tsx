import { Select } from '../../../Form'

interface Props {
  name: string
  options: { text: string; value: string }[]
  register: any
  error: { message: string }
  onChange: (value: string) => void
  // Only passed for rows that can be removed, i.e. every row except the first
  onRemove?: () => void
}

export const ReasonForRepairRow = (props: Props) => {
  const { name, options, register, error, onChange, onRemove } = props

  return (
    <div className="reason-for-repair__row">
      <Select
        name={name}
        label="Reason"
        options={options}
        required={true}
        register={register({
          required: 'Please select an option',
        })}
        error={error}
        widthClass="govuk-!-width-full"
        onChange={(e) => onChange(e.target.value)}
        hint={undefined}
        children={undefined}
        ignoreValue={undefined}
        defaultValue={undefined}
        value={undefined}
        disabled={undefined}
      />

      {/* Always rendered so the first row's dropdown is the same width as the rest */}
      <div className="reason-for-repair__action">
        {onRemove && (
          <a
            className="lbh-link"
            href="#"
            data-testid={`remove-${name}-link`}
            onClick={(e) => {
              e.preventDefault()
              onRemove()
            }}
          >
            Remove
          </a>
        )}
      </div>
    </div>
  )
}
