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
                allOperatives.filter((op) => op.id == selectedOperativeId)
                  .length > 1
              ) {
                return 'This operative has already been added'
              }
            },
          })}
          error={errors && errors[name]}
          additionalDivClasses={['govuk-!-display-inline-block']}
        />

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
