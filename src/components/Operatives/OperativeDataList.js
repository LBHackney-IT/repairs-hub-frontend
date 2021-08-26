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
  isOperativeNameSelected,
  allOperatives,
  onSelectedOperative,
  getValues,
}) => {
  const [selectedOperativeName, setSelectedOperativeName] = useState(value)
  const [selectedOperativeId, setSelectedOperativeId] = useState(operativeId)

  const OPERATIVE_ID_REGEX = /\[(\d+)\]$/

  const onChange = (e) => {
    setSelectedOperativeName(e.target.value)

    const idMatch = e.target.value.match(OPERATIVE_ID_REGEX)
    const newOperativeId = Array.isArray(idMatch)
      ? idMatch[idMatch.length - 1]
      : ''
    isOperativeNameSelected(true)
    setSelectedOperativeId(newOperativeId)
    onSelectedOperative(newOperativeId, index)
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
              if (!options.includes(value)) {
                return 'Please select an operative'
              } else if (
                !allOperatives.includes(null) &&
                !allOperatives.includes(undefined) &&
                Object.entries(getValues())
                  .filter(
                    ([k]) => k !== `operative-${index}` && k.match(/operative-/)
                  )
                  .some(([_id, name], i) => name === value && i < index)
              ) {
                return 'This operative has already been added'
              }
            },
          })}
          error={errors && errors[name]}
          additionalDivClasses={['govuk-!-display-inline-block']}
        />
        <div>
          {showAddOperative && (
            <a className="lbh-link" href="#" onClick={addOperativeHandler}>
              + Add operative from list
            </a>
          )}
        </div>
        <div>
          {showRemoveOperative && (
            <a
              className="lbh-link"
              href="#"
              onClick={(e) => removeOperativeHandler(index, e)}
            >
              - Remove operative from list
            </a>
          )}
        </div>
        <input
          id={`operativeId-${index}`}
          name={`operativeId-${index}`}
          type="hidden"
          ref={register}
          value={selectedOperativeId}
        />
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
