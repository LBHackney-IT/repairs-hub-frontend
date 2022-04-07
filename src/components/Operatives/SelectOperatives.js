import PropTypes from 'prop-types'
import { useState } from 'react'
import cx from 'classnames'
import OperativeDataList from './OperativeDataList'
import SelectPercentage from '../WorkOrders/SelectPercentage'

const SelectOperatives = ({
  assignedOperativesToWorkOrder,
  availableOperatives,
  register,
  errors,
  selectedPercentagesToShowOnEdit,
  trigger,
  getValues,
  totalSMV,
  currentUserPayrollNumber,
  jobIsSplitByOperative,
}) => {
  const [selectedOperatives, setSelectedOperatives] = useState(
    // Add at least one slot for an operative
    assignedOperativesToWorkOrder.length > 0
      ? assignedOperativesToWorkOrder
      : [null]
  )
  const [operativeNameIsSelected, setOperativeNameIsSelected] = useState(false)

  const onSelectedOperative = (operativeId, index) => {
    selectedOperatives[index] = availableOperatives.find(
      (operative) => operative.id === parseInt(operativeId)
    )

    setSelectedOperatives(selectedOperatives)
  }

  const isOperativeNameSelected = (nameWasSelected) => {
    setOperativeNameIsSelected(nameWasSelected)
  }

  const formatOperativeOptionText = (id, name) => `${name} [${id}]`

  const caculateInitialPercentage = (currentOperativesNumber) => {
    if (selectedPercentagesToShowOnEdit.length > 0) {
      return selectedPercentagesToShowOnEdit
    } else if (currentOperativesNumber === 1) {
      return ['100%']
    } else if (currentOperativesNumber === 2) {
      return ['50%', '50%']
    } else if (currentOperativesNumber === 3) {
      return ['33.3%', '33.3%', '33.3%']
    } else if (currentOperativesNumber === 0) {
      //for the cases when there are no assigned operatives
      return ['-']
    }
    let operativeIndexPercentages = []
    for (let i = 0; i < currentOperativesNumber; i++) {
      operativeIndexPercentages.push('-')
    }
    return operativeIndexPercentages
  }

  const [updatedPercentages, setUpdatedPercentages] = useState(
    caculateInitialPercentage(assignedOperativesToWorkOrder.length)
  )

  const calculateTotalPercentage = (
    selOperatives,
    operativesIndexPercentages
  ) => {
    //not using rounding logic in case options are (33.3, 33.3 and 30, then it will round it to 100, and it is not correct)
    if (
      selOperatives.length === 3 &&
      operativesIndexPercentages[0] === '33.3%' &&
      operativesIndexPercentages[1] === '33.3%' &&
      operativesIndexPercentages[2] === '33.3%'
    ) {
      return 100
    }
    return [...Array(selOperatives.length).keys()]
      .map((activeOperativeIndex) => {
        if (
          operativesIndexPercentages[activeOperativeIndex] == '-' ||
          Object.keys(operativesIndexPercentages).length === 0
        ) {
          return 0
        } else {
          return parseInt(
            operativesIndexPercentages[activeOperativeIndex].slice(0, -1)
          )
        }
      })
      .reduce((a, b) => {
        return a + b
      })
  }

  const updatePercentages = (operativeIndex, selectedPercentage) => {
    updatedPercentages[operativeIndex] = selectedPercentage
    setUpdatedPercentages(updatedPercentages)

    calculateTotalPercentage(selectedOperatives, updatedPercentages)

    if (errors && errors[`percentage-0`]) {
      trigger()
    }
  }

  const duplicateOperativeErrors = (errors) => {
    return Object.entries(errors).some(
      ([a, b]) =>
        a.match(/operative/) && b['message'].match(/already been added/)
    )
  }

  return (
    <>
      <div
        className={cx('operatives', {
          'govuk-form-group--error':
            errors &&
            (errors['percentage-0'] || duplicateOperativeErrors(errors)),
        })}
      >
        <p className="govuk-heading-m">
          Search by operative name and select from the list
        </p>

        {errors &&
          (errors['percentage-0'] || duplicateOperativeErrors(errors)) && (
            <span className="govuk-error-message lbh-error-message">
              <span className="govuk-visually-hidden">Error:</span>{' '}
              {errors['percentage-0']?.message}
              {
                Object.entries(errors).find(([a]) => a.match(/operative/))
                  ?.message
              }
            </span>
          )}

        {selectedOperatives.map((selectedOperative, index) => {
          const operativeIsCurrentUser =
            currentUserPayrollNumber &&
            currentUserPayrollNumber === selectedOperative?.payrollNumber

          return (
            <div key={index}>
              <OperativeDataList
                label={`Operative name ${index + 1} *`}
                name={
                  operativeIsCurrentUser
                    ? `operative-disabled-${index}`
                    : `operative-${index}`
                }
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
                operativeId={selectedOperative ? selectedOperative.id : -1}
                index={index}
                register={register}
                errors={errors}
                isOperativeNameSelected={isOperativeNameSelected}
                onSelectedOperative={onSelectedOperative}
                selectedOperatives={selectedOperatives}
                getValues={getValues}
                {...(operativeIsCurrentUser && { disabled: 'disabled' })}
              />

              <SelectPercentage
                updatePercentages={updatePercentages}
                index={index}
                operativeIndex={index}
                assignedOperativesToWorkOrder={
                  assignedOperativesToWorkOrder.length
                }
                selectedOperatives={selectedOperatives}
                operativeNameIsSelected={operativeNameIsSelected}
                errors={errors}
                register={register({
                  validate: () => {
                    return (
                      calculateTotalPercentage(
                        selectedOperatives,
                        updatedPercentages
                      ) === 100 ||
                      'Work done total across operatives must be equal to 100%'
                    )
                  },
                })}
                preSelectedPercentages={selectedPercentagesToShowOnEdit[index]}
                totalSMV={totalSMV}
                selectedOperativePercentage={
                  selectedOperative ? selectedOperative.jobPercentage : null
                }
                jobIsSplitByOperative={jobIsSplitByOperative}
              />
            </div>
          )
        })}
        <div>
          <a
            className="lbh-link"
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setSelectedOperatives([...selectedOperatives, null])
              let newSelectedPercentages = updatedPercentages
              newSelectedPercentages.push('-')
              setUpdatedPercentages(newSelectedPercentages)
            }}
          >
            + Add operative from list
          </a>
        </div>
        <div>
          {selectedOperatives.length > 1 && (
            <a
              className="lbh-link"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                let newSelectedOperatives = [
                  ...selectedOperatives.slice(0, selectedOperatives.length - 1),
                ]
                let newSelectedPercentages = [
                  ...updatedPercentages.slice(0, selectedOperatives.length - 1),
                ]
                setUpdatedPercentages(newSelectedPercentages)
                setSelectedOperatives(newSelectedOperatives)
              }}
            >
              - Remove operative from list
            </a>
          )}
        </div>
      </div>
    </>
  )
}

SelectOperatives.propTypes = {
  assignedOperativesToWorkOrder: PropTypes.array.isRequired,
  availableOperatives: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  totalSMV: PropTypes.number.isRequired,
  jobIsSplitByOperative: PropTypes.bool.isRequired,
}

export default SelectOperatives
