import ProperTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Select from '../Form/Select/Select'

const SelectPercentage = ({
  updatePercentages,
  operativeIndex,
  index,
  assignedOperativesToWorkOrder,
  allOperatives,
  operativeNameIsSelected,
  errors,
  register,
}) => {
  const isOnlyOneOperative = (allOperatives) => {
    return allOperatives.length === 1
  }

  const getDefaultPercentage = (allOperatives) => {
    if (
      (operativeIndex === 0 &&
        allOperatives.length === 1 &&
        operativeNameIsSelected) ||
      (operativeIndex === 0 &&
        allOperatives.length === 1 &&
        assignedOperativesToWorkOrder === 1)
    ) {
      return '100%'
    } else if (
      assignedOperativesToWorkOrder === 2 &&
      allOperatives.length === 2
    ) {
      return '50%'
    } else if (
      assignedOperativesToWorkOrder === 3 &&
      allOperatives.length === 3
    ) {
      return '33.3%'
    }
    return '-'
  }
  const [selectedPercentage, setSelectedPercentage] = useState(
    getDefaultPercentage(allOperatives)
  )

  const getPossiblePercentages = (allOperatives) => {
    if (isOnlyOneOperative(allOperatives)) {
      return ['100%', '-']
    } else if (allOperatives.length == 3) {
      return [
        '100%',
        '90%',
        '80%',
        '70%',
        '60%',
        '50%',
        '40%',
        '30%',
        '33.3%',
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
    if (errors && errors[`percentage-0`]) {
      delete errors[`percentage-0`]
    }
    setSelectedPercentage(e.target.value)
    updatePercentages(operativeIndex, e.target.value)
  }

  useEffect(() => {
    let onlyOneOperativeAndSelectedOperative =
      operativeIndex === 0 &&
      allOperatives.length === 1 &&
      operativeNameIsSelected
    let onlyOneAssignedOperative =
      operativeIndex === 0 &&
      allOperatives.length === 1 &&
      assignedOperativesToWorkOrder === 1
    if (onlyOneOperativeAndSelectedOperative || onlyOneAssignedOperative) {
      if (errors && errors[`percentage-${operativeIndex}`]) {
        delete errors[`percentage-${operativeIndex}`]
      }
      setSelectedPercentage('100%')
      updatePercentages(operativeIndex, '100%')
    } else if (allOperatives.length !== 3 && selectedPercentage === '33.3%') {
      setSelectedPercentage('-')
      updatePercentages(operativeIndex, '-')
    }
  }, [allOperatives, operativeNameIsSelected, selectedPercentage])

  let isDisabled = isOnlyOneOperative(allOperatives)
  return (
    <>
      <div className="select_percentage">
        <Select
          label="Work done"
          name={`percentage-${index}`}
          options={getPossiblePercentages(allOperatives)}
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
              options={getPossiblePercentages(allOperatives)}
              value={selectedPercentage}
              register={register}
            />
          </div>
        )}
      </div>
    </>
  )
}

SelectPercentage.prototype = {
  operativesNumber: ProperTypes.number,
  operativeIndex: ProperTypes.number,
}

export default SelectPercentage
