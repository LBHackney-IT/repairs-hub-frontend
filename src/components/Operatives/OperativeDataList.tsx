import { DataList } from '../Form'

interface Props {
  selectedOperative: string
  name: string
  options: string[]
  label: string
  index: number
  register: any
  errors: any
  isOperativeNameSelected: (selected: boolean) => void
  getValues?: any
  disabled?: boolean | string
  operativeId?: number
  onSelectedOperative?: any
  selectedOperatives?: any
}

const OperativeDataList = ({
  selectedOperative,
  name,
  options,
  label,
  index,
  register,
  errors,
  isOperativeNameSelected,
  getValues,
  disabled,
}: Props) => {
  const onChange = () => {
    isOperativeNameSelected(true)
  }

  return (
    <>
      <DataList
        name={name}
        onChange={onChange}
        defaultValue={selectedOperative}
        options={options}
        label={label}
        register={register({
          validate: (value) => {
            if (!options.includes(value)) {
              return 'Please select an operative'
            } else if (
              Object.entries(getValues())
                .filter(
                  ([k]) => k !== `operative-${index}` && k.match(/operative-/)
                )
                .some(([, name], i) => name === value && i < index)
            ) {
              return 'This operative has already been added'
            }
          },
        })}
        error={errors && errors[name]}
        additionalDivClasses={['operative-datalist']}
        widthClass="govuk-!-width-full"
        disabled={disabled}
      />

      {disabled && (
        <input
          name={`operative-${index}`}
          type="hidden"
          value={selectedOperative}
          ref={register}
        />
      )}
    </>
  )
}

export default OperativeDataList
