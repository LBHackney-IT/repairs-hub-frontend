import PropTypes from 'prop-types'
import { useState } from 'react'
import OperativeDataList from './OperativeDataList'

const SelectOperatives = ({
  currentOperatives,
  availableOperatives,
  register,
  errors,
}) => {
  const [selectedOperatives, setSelectedOperatives] = useState(
    // Add at least one slot for an operative
    currentOperatives.length > 0 ? currentOperatives : [null]
  )

  const formatOperativeOptionText = (id, name) => `${name} [${id}]`

  return (
    <>
      <div className="operatives">
        <p className="govuk-heading-m">
          Search by operative name and select from the list
        </p>

        {selectedOperatives.map((selectedOperative, index) => {
          return (
            <OperativeDataList
              key={index}
              label={`Operative name ${index + 1} *`}
              name={`operative-${index}`}
              selectedOperative={
                selectedOperative
                  ? formatOperativeOptionText(
                      selectedOperative.id,
                      selectedOperative.name
                    )
                  : ''
              }
              options={availableOperatives.map((operative) =>
                formatOperativeOptionText(operative.id, operative.name)
              )}
              index={index}
              register={register}
              errors={errors}
              showAddOperative={index === selectedOperatives.length - 1}
              addOperativeHandler={(e) => {
                e.preventDefault()
                setSelectedOperatives([...selectedOperatives, null])
              }}
              showRemoveOperative={
                index > 0 && index === selectedOperatives.length - 1
              }
              removeOperativeHandler={(operativeIndex) => {
                setSelectedOperatives([
                  ...selectedOperatives.slice(0, operativeIndex),
                  ...selectedOperatives.slice(operativeIndex + 1),
                ])
              }}
            />
          )
        })}
      </div>
    </>
  )
}

SelectOperatives.propTypes = {
  currentOperatives: PropTypes.array.isRequired,
  availableOperatives: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
}

export default SelectOperatives
