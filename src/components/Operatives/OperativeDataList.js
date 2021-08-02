import PropTypes from 'prop-types'
import { useState } from 'react'
import { DataList } from '../Form'

const OperativeDataList = ({
  name,
  value,
  options,
  label,
  index,
  operativeId,
  register,
  errors,
  showAddOperative,
  addOperativeHandler,
  showRemoveOperative,
  removeOperativeHandler,
  someFunction,
}) => {
  //maybe add here call back function that will update selected operativeName
  // or maybe move this function to SelectOperatives component
  const [selectedOperativeName, setSelectedOperativeName] = useState(value)
  const [selectedOperativeId, setSelectedOperativeId] = useState(operativeId)

  const OPERATIVE_ID_REGEX = /\[(\d+)\]$/

  const onChange = (e) => {
    setSelectedOperativeName(e.target.value)

    const idMatch = e.target.value.match(OPERATIVE_ID_REGEX)
    const newOperativeId = Array.isArray(idMatch)
      ? idMatch[idMatch.length - 1]
      : ''
    someFunction(true)
    setSelectedOperativeId(newOperativeId)
  }

  return (
    <>
      <div>
        <DataList
          name={name}
          onChange={onChange}
          value={selectedOperativeName}
          options={options}
          label={label}
          register={register({
            validate: (value) => {
              setSelectedOperativeName(value)
              return options.includes(value) || 'Please select an operative'
            },
          })}
          error={errors && errors[name]}
          // additionalDivClasses={['govuk-!-display-inline-block']}
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
        <input
          id={`operativeId-${index}`}
          name={`operativeId-${index}`}
          type="hidden"
          ref={register}
          value={selectedOperativeId}
        />
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
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  operativeId: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  options: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
}

export default OperativeDataList
