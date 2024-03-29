import PropTypes from 'prop-types'
import { DataList } from '../Form'

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
}) => {
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

OperativeDataList.propTypes = {
  name: PropTypes.string.isRequired,
  selectedOperative: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  options: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
}

export default OperativeDataList
