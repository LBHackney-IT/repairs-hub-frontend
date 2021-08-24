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
  showAddOperative,
  addOperativeHandler,
  showRemoveOperative,
  removeOperativeHandler,
}) => {
  return (
    <>
      <div>
        <DataList
          defaultValue={selectedOperative}
          name={name}
          options={options}
          label={label}
          register={register({
            validate: (value) => {
              return options.includes(value) || 'Please select an operative'
            },
          })}
          error={errors && errors[name]}
          additionalDivClasses={['govuk-!-display-inline-block']}
        />
        {showRemoveOperative && (
          <button
            className="cursor-pointer govuk-!-margin-left-2"
            aria-label="Remove operative"
            type="button"
            onClick={() => removeOperativeHandler(index)}
          >
            -
          </button>
        )}
      </div>

      <div>
        {showAddOperative && (
          <a className="lbh-link" href="#" onClick={addOperativeHandler}>
            + Add operative from list
          </a>
        )}
      </div>
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
