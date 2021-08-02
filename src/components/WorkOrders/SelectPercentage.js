import ProperTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Select from '../Form/Select/Select'

const SelectPercentage = ({
  updatePercentages,
  operativeIndex,
  currentOperatives,
  selectedOperatives,
  operativeNameIsSelected,
}) => {
  //need to check if operatives were assigned
  //if 1 operative was assigned then show 100%, 2- 50/50, 3- 33/33/33
  // if no operatives were assigned and the field of operatives is blank, show '-' instead of 100%

  const isOnlyOneOperative = (selectedOperatives) => {
    return selectedOperatives.length === 1
  }

  const getDefaultPercentage = (selectedOperatives) => {
    if (
      (operativeIndex === 0 &&
        selectedOperatives.length === 1 &&
        operativeNameIsSelected) ||
      (operativeIndex === 0 &&
        selectedOperatives.length === 1 &&
        currentOperatives === 1)
    ) {
      return '100%'
    } else if (currentOperatives === 2 && selectedOperatives.length === 2) {
      return '50%'
    } else if (currentOperatives === 3 && selectedOperatives.length === 3) {
      return '33.3%'
    }
    return '—'
  }
  const [selectedPercentage, setSelectedPercentage] = useState(
    getDefaultPercentage(selectedOperatives)
  )

  const getPossiblePercentages = (selectedOperatives) => {
    if (isOnlyOneOperative(selectedOperatives)) {
      return ['100%']
    } else if (selectedOperatives.length == 3) {
      return [
        '100%',
        '90%',
        '80%',
        '50%',
        '40%',
        '30%',
        '33.3%',
        '20%',
        '10%',
        '—',
      ]
    } else {
      return ['100%', '90%', '80%', '50%', '40%', '30%', '20%', '10%', '—']
    }
  }

  const onChange = (e) => {
    setSelectedPercentage(e.target.value)
    updatePercentages(operativeIndex, e.target.value)
  }

  useEffect(() => {
    let onlyOneOperativeAndSelectedOperative =
      operativeIndex === 0 &&
      selectedOperatives.length === 1 &&
      operativeNameIsSelected
    let onlyOneAssignedOperative =
      operativeIndex === 0 &&
      selectedOperatives.length === 1 &&
      currentOperatives === 1
    if (onlyOneOperativeAndSelectedOperative || onlyOneAssignedOperative) {
      setSelectedPercentage('100%')
      updatePercentages(operativeIndex, '100%')
    } else if (
      selectedOperatives.length !== 3 &&
      selectedPercentage === '33.3%'
    ) {
      setSelectedPercentage('—')
      updatePercentages(operativeIndex, '—')
    }
  }, [selectedOperatives, operativeNameIsSelected])

  return (
    <>
      <div className="select_percentage">
        <Select
          label=" percentage"
          name="percentage"
          options={getPossiblePercentages(selectedOperatives)}
          value={selectedPercentage}
          disabled={isOnlyOneOperative(selectedOperatives)}
          onChange={onChange}
        />
      </div>
    </>
  )
}

SelectPercentage.prototype = {
  operativesNumber: ProperTypes.number,
  operativeIndex: ProperTypes.number,
}

export default SelectPercentage
