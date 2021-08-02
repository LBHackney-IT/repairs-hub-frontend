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
        additionalDivClasses={['govuk-!-display-inline-block']}
      />
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
