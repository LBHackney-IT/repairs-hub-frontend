import PropTypes from 'prop-types'
import { useState, Fragment } from 'react'
import RateScheduleItem from '../../WorkElement/RateScheduleItem'
import ErrorMessage from '../../Errors/ErrorMessage'
import Spinner from '../../Spinner'
import { calculateTotal } from '../../../utils/helpers/calculations'

const RateScheduleItemView = ({
  sorCodes,
  register,
  errors,
  disabled,
  updatePriority,
  getPriorityObjectByCode,
  loading,
  apiError,
  setTotalCost,
}) => {
  const [
    arrayOfRateScheduleItemComponentIndexes,
    setArrayOfRateScheduleItemComponentIndexes,
  ] = useState([0])

  const [rateScheduleItemPriorities, setRateScheduleItemPriorities] = useState(
    []
  )
  const [rateScheduleItemCosts, setRateScheduleItemCosts] = useState([])

  const sorCodesList = sorCodes.map(
    (sorCode) => `${sorCode.code} - ${sorCode.shortDescription}`
  )

  const getSorCodeObject = (value) => {
    return sorCodes.filter((a) => a.code == value)[0]
  }

  const updateTotalCost = (rateScheduleItemCosts) => {
    setTotalCost(calculateTotal(rateScheduleItemCosts, 'cost', 'quantity'))
  }

  const onQuantityInput = (index, event) => {
    const quantity = parseFloat(event.target.value) || 0
    const costPerUnit = parseFloat(
      document.getElementById(`rateScheduleItems[${index}][cost]`).value
    )

    const rateScheduleItemCostAtSameIndex = rateScheduleItemCosts.find(
      (e) => e.index === index
    )

    if (rateScheduleItemCostAtSameIndex) {
      rateScheduleItemCostAtSameIndex.cost = costPerUnit
      rateScheduleItemCostAtSameIndex.quantity = quantity

      setRateScheduleItemCosts(rateScheduleItemCosts)
      updateTotalCost(rateScheduleItemCosts)
    } else {
      const newRateScheduleItemCosts = [
        ...rateScheduleItemCosts,
        {
          index: index,
          cost: costPerUnit,
          quantity: quantity,
        },
      ]

      setRateScheduleItemCosts(newRateScheduleItemCosts)
      updateTotalCost(newRateScheduleItemCosts)
    }
  }

  const onRateScheduleItemSelect = (index, event) => {
    document.getElementById('priorityDescription').disabled = false

    const value = event.target.value.split(' - ')[0]
    const sorCodeObject = getSorCodeObject(value)
    const sorCodeDescription = sorCodeObject?.shortDescription || ''

    // Set hidden description value
    document.getElementById(
      `rateScheduleItems[${index}][description]`
    ).value = sorCodeDescription
    // Set hidden cost value
    document.getElementById(`rateScheduleItems[${index}][cost]`).value =
      sorCodeObject?.cost

    if (sorCodeObject?.priority?.priorityCode) {
      const rateScheduleItemPriorityAtSameIndex = rateScheduleItemPriorities.find(
        (e) => e.index === index
      )

      if (rateScheduleItemPriorityAtSameIndex) {
        rateScheduleItemPriorityAtSameIndex.code =
          sorCodeObject.priority.priorityCode
      } else {
        setRateScheduleItemPriorities((rateScheduleItemPriorities) => [
          ...rateScheduleItemPriorities,
          {
            index: index,
            code: sorCodeObject.priority.priorityCode,
          },
        ])
      }

      let sortedByPriorityCode = rateScheduleItemPriorities.sort(
        (a, b) => a.code - b.code
      )
      const existingHigherPriority = sortedByPriorityCode.find(
        (e) => e.code <= sorCodeObject.priority.priorityCode
      )

      updatePriority(
        sorCodeObject.priority.description,
        sorCodeObject.priority.priorityCode,
        rateScheduleItemPriorities.length,
        existingHigherPriority?.code
      )
    }
  }

  const addRateScheduleItem = (e) => {
    e.preventDefault()

    setArrayOfRateScheduleItemComponentIndexes(
      (arrayOfRateScheduleItemComponentIndexes) => [
        ...arrayOfRateScheduleItemComponentIndexes,
        arrayOfRateScheduleItemComponentIndexes.slice(-1)[0] + 1,
      ]
    )
  }

  const removeRateScheduleItem = (index) => {
    setArrayOfRateScheduleItemComponentIndexes(
      (arrayOfRateScheduleItemComponentIndexes) =>
        arrayOfRateScheduleItemComponentIndexes.filter((i) => i !== index)
    )

    const remainingRateScheduleItemPriorities = rateScheduleItemPriorities.filter(
      (i) => i.index !== index
    )
    setRateScheduleItemPriorities(remainingRateScheduleItemPriorities)

    const remainingRateScheduleItemCosts = rateScheduleItemCosts.filter(
      (i) => i.index !== index
    )
    setRateScheduleItemCosts(remainingRateScheduleItemCosts)
    updateTotalCost(remainingRateScheduleItemCosts)

    if (remainingRateScheduleItemPriorities.length > 0) {
      const highestPriorityCode = Math.min(
        ...remainingRateScheduleItemPriorities.map((object) => object.code)
      )
      const priorityObject = getPriorityObjectByCode(highestPriorityCode)

      priorityObject &&
        updatePriority(
          priorityObject.description,
          priorityObject.priorityCode,
          remainingRateScheduleItemPriorities.length,
          highestPriorityCode
        )
    }
  }

  const rateScheduleItems = () => {
    return arrayOfRateScheduleItemComponentIndexes.map((i) => {
      return (
        <Fragment key={`rateScheduleItem~${i}`}>
          <RateScheduleItem
            sorCodesList={sorCodesList}
            register={register}
            errors={errors}
            disabled={disabled}
            key={i}
            index={i}
            onChange={onRateScheduleItemSelect}
            onInputChange={onQuantityInput}
            showRemoveRateScheduleItem={i > 0}
            removeRateScheduleItem={removeRateScheduleItem}
          />
        </Fragment>
      )
    })
  }

  return (
    <div className="min-height-120 govuk-!-margin-bottom-6">
      {loading ? (
        <Spinner />
      ) : (
        <div>
          {rateScheduleItems()}
          {apiError && <ErrorMessage label={apiError} />}

          <a className="lbh-link" href="#" onClick={addRateScheduleItem}>
            + Add another SOR code
          </a>
        </div>
      )}
    </div>
  )
}

RateScheduleItemView.propTypes = {
  sorCodes: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  updatePriority: PropTypes.func.isRequired,
  getPriorityObjectByCode: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  apiError: PropTypes.bool,
}

export default RateScheduleItemView
