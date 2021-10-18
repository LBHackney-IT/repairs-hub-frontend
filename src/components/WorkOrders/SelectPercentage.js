import ProperTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Select from '../Form/Select'

const SelectPercentage = ({
  updatePercentages,
  operativeIndex,
  index,
  assignedOperativesToWorkOrder,
  selectedOperatives,
  operativeNameIsSelected,
  register,
  preSelectedPercentages,
  totalSMV,
}) => {
  const isOnlyOneOperative = (selectedOperatives) => {
    return selectedOperatives.length === 1
  }

  const getDefaultPercentage = (selectedOperatives) => {
    if (preSelectedPercentages && selectedOperatives.length !== 1) {
      return preSelectedPercentages
    } else if (
      (operativeIndex === 0 &&
        selectedOperatives.length === 1 &&
        operativeNameIsSelected) ||
      (operativeIndex === 0 &&
        selectedOperatives.length === 1 &&
        assignedOperativesToWorkOrder === 1)
    ) {
      return '100%'
    } else if (
      assignedOperativesToWorkOrder === 2 &&
      selectedOperatives.length === 2
    ) {
      return '50%'
    } else if (
      assignedOperativesToWorkOrder === 3 &&
      selectedOperatives.length === 3
    ) {
      return '33.3%'
    }
    return '-'
  }
  const [selectedPercentage, setSelectedPercentage] = useState(
    getDefaultPercentage(selectedOperatives)
  )

  const calculateSMV = (percentage) => {
    return percentage === '-'
      ? '-'
      : (parseFloat(percentage.split('%')[0]) * 0.01 * totalSMV).toFixed(2)
  }
  const [smv, setSmv] = useState(calculateSMV(selectedPercentage))

  const getPossiblePercentages = (selectedOperatives) => {
    if (isOnlyOneOperative(selectedOperatives)) {
      return ['100%', '-']
    } else if (selectedOperatives.length == 3) {
      return [
        '100%',
        '90%',
        '80%',
        '70%',
        '60%',
        '50%',
        '40%',
        '33.3%',
        '30%',
        '20%',
        '10%',
        '-',
      ]
    } else {
      return [
        '100%',
        '90%',
        '80%',
        '70%',
        '60%',
        '50%',
        '40%',
        '30%',
        '20%',
        '10%',
        '-',
      ]
    }
  }

  const onChange = (e) => {
    // if percentage errors, then update state and percentages
    // then trigger validation
    setSelectedPercentage(e.target.value)
    updatePercentages(operativeIndex, e.target.value)
    setSmv(calculateSMV(e.target.value))
  }

  useEffect(() => {
    let onlyOneOperativeAndSelectedOperative =
      operativeIndex === 0 &&
      selectedOperatives.length === 1 &&
      operativeNameIsSelected
    let onlyOneAssignedOperative =
      operativeIndex === 0 &&
      selectedOperatives.length === 1 &&
      assignedOperativesToWorkOrder === 1
    let some = preSelectedPercentages && selectedOperatives.length === 1
    if (
      onlyOneOperativeAndSelectedOperative ||
      onlyOneAssignedOperative ||
      some
    ) {
      setSelectedPercentage('100%')
      updatePercentages(operativeIndex, '100%')
      setSmv(totalSMV)
    } else if (
      selectedOperatives.length !== 3 &&
      selectedPercentage === '33.3%'
    ) {
      setSelectedPercentage('-')
      updatePercentages(operativeIndex, '-')
      setSmv('-')
    }
  }, [selectedOperatives, operativeNameIsSelected, selectedPercentage, smv])

  let isDisabled = isOnlyOneOperative(selectedOperatives)

  return (
    <>
      <div className="select_percentage govuk-!-display-inline-block govuk-!-margin-left-4">
        <Select
          label="Work done"
          name={`percentage-${index}`}
          options={getPossiblePercentages(selectedOperatives)}
          value={selectedPercentage}
          disabled={isDisabled}
          onChange={onChange}
          register={register}
        />
        {/* Disabled elements are not sent on onSubmit, so if the element is disabled
            we create another hidden input with the same name and the same value.
            This one will be sent */}
        {isDisabled && (
          <div style={{ display: 'none' }}>
            <Select
              label="Work done"
              name={`percentage-${index}`}
              options={getPossiblePercentages(selectedOperatives)}
              value={selectedPercentage}
              register={register}
            />
          </div>
        )}
      </div>
      <div className="smv-read-only govuk-!-display-inline-block govuk-!-margin-left-4">
        <label className="govuk-label lbh-label">SMV</label>
        <div className="smv-splitting-page">
          <label
            className={`smv-${index} govuk-label lbh-label govuk-!-margin-left-1`}
          >
            {smv}
          </label>
        </div>
      </div>
    </>
  )
}

SelectPercentage.prototype = {
  operativesNumber: ProperTypes.number,
  operativeIndex: ProperTypes.number,
  totalSMV: ProperTypes.number.isRequired,
}

export default SelectPercentage
