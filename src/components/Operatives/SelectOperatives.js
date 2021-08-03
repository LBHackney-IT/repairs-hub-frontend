import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import OperativeDataList from './OperativeDataList'
import SelectPercentage from '../WorkOrders/SelectPercentage'
import { GridRow, GridColumn } from '../Layout/Grid'

const SelectOperatives = ({
  assignedOperativesToWorkOrder,
  availableOperatives,
  register,
  errors,
}) => {
  const [allOperatives, setAllOperatives] = useState(
    // Add at least one slot for an operative
    assignedOperativesToWorkOrder.length > 0 ? assignedOperativesToWorkOrder : [null]
  )
  const [operativeNameIsSelected, setOperativeNameIsSelected] = useState(false)

  //check if operative name is selected (rename the function)
  const isOperativeNameSelected = (nameWasSelected) => {
    setOperativeNameIsSelected(nameWasSelected)
  }

  const formatOperativeOptionText = (id, name) => `${name} [${id}]`

  const caculateInitialPercentage = (currentOperativesNumber) => {
    if (currentOperativesNumber === 1) {
      return { 0: '100%' }
    } else if (currentOperativesNumber === 2) {
      return { 0: '50%', 1: '50%' }
    } else if (currentOperativesNumber === 3) {
      return { 0: '33.3%', 1: '33.3%', 2: '33.3%' }
    }
    let operativeIndexPercentages = {}
    for (let i = 0; i < currentOperativesNumber; i++) {
      operativeIndexPercentages[i] = '—'
    }
    return operativeIndexPercentages
  }

  const [updatedPercentages, setUpdatedPercentages] = useState(
    caculateInitialPercentage(assignedOperativesToWorkOrder.length)
  )

  //check that all are 33%, then all should be 33%
  //for errors
  const calculateTotalPercentage = (
    selOperatives,
    operativesIndexPercentages
  ) => {
    if (
      selOperatives.length == 3 &&
      operativesIndexPercentages[0] === '33.3%' &&
      operativesIndexPercentages[1] === '33.3%' &&
      operativesIndexPercentages[2] === '33.3%'
    ) {
      return 100
    }
    return [...Array(selOperatives.length).keys()]
      .map((activeOperativeIndex) => {
        if (operativesIndexPercentages[activeOperativeIndex] == '—') {
          return 0
        }
        console.log('*********')
        console.log(operativesIndexPercentages)
        console.log(activeOperativeIndex)
        return parseInt(
          operativesIndexPercentages[activeOperativeIndex].slice(0, -1)
        )
      })
      .reduce((a, b) => {
        return a + b
      })
  }

  const updatePercentages = (operativeIndex, selectedPercentage) => {
    updatedPercentages[operativeIndex] = selectedPercentage
    setUpdatedPercentages(updatedPercentages)
    console.log('calling update percentages')
    console.log(
      calculateTotalPercentage(allOperatives, updatedPercentages)
    )
  }

  return (
    <>
      <div className="operatives">
        <p className="govuk-heading-m">
          Search by operative name and select from the list
        </p>

        {allOperatives.map((operative, index) => {
          return (
            <GridRow key={index} className="display-flex position-relative">
              <GridColumn width="two-thirds">
                <OperativeDataList
                  key={index}
                  label={`Operative name ${index + 1} *`}
                  name={`operative-${index}`}
                  value={
                    operative
                      ? formatOperativeOptionText(operative.id, operative.name)
                      : ''
                  }
                  options={availableOperatives.map((operative) =>
                    formatOperativeOptionText(operative.id, operative.name)
                  )}
                  operativeId={operative ? operative.id : -1}
                  index={index}
                  register={register}
                  errors={errors}
                  showAddOperative={index === allOperatives.length - 1}
                  addOperativeHandler={(e) => {
                    e.preventDefault()
                    setAllOperatives([...allOperatives, null])
                    updatedPercentages[allOperatives.length] = '—'
                  }}
                  showRemoveOperative={
                    index > 0 &&
                    index === allOperatives.length - 1 &&
                    allOperatives.length > assignedOperativesToWorkOrder.length
                  }
                  removeOperativeHandler={(operativeIndex) => {
                    let newSelectedOperatives = [
                      ...allOperatives.slice(0, operativeIndex),
                      ...allOperatives.slice(operativeIndex + 1),
                    ]
                    //move this function call => on submit validation
                    console.log(
                      calculateTotalPercentage(
                        newSelectedOperatives,
                        updatedPercentages
                      )
                    )
                    setAllOperatives(newSelectedOperatives)
                  }}
                  isOperativeNameSelected={isOperativeNameSelected}
                />
              </GridColumn>
              <GridColumn width="one-third">
                <SelectPercentage
                  updatePercentages={updatePercentages}
                  operativeIndex={index}
                  assignedOperativesToWorkOrder={assignedOperativesToWorkOrder.length}
                  allOperatives={allOperatives}
                  operativeNameIsSelected={operativeNameIsSelected}
                />
              </GridColumn>
            </GridRow>
          )
        })}
      </div>
    </>
  )
}

SelectOperatives.propTypes = {
  assignedOperativesToWorkOrder: PropTypes.array.isRequired,
  availableOperatives: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
}

export default SelectOperatives
