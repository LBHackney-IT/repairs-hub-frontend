import PropTypes from 'prop-types'
import { useState, Fragment } from 'react'
import RateScheduleItem from '../../WorkElement/RateScheduleItem'
import { calculateTotal } from '@/utils/helpers/calculations'
import Spinner from '@/components/Spinner'
import ErrorMessage from '@/components/Errors/ErrorMessage'

const RateScheduleItemView = ({
  register,
  errors,
  disabled,
  updatePriority,
  getPriorityObjectByCode,
  loading,
  apiError,
  setTotalCost,
  sorCodeArrays,
  setSorCodeArrays,
  sorSearchRequest,
}) => {
  const [
    arrayOfRateScheduleItemComponentIndexes,
    setArrayOfRateScheduleItemComponentIndexes,
  ] = useState([0])

  const [rateScheduleItemPriorities, setRateScheduleItemPriorities] = useState(
    []
  )
  const [rateScheduleItemCosts, setRateScheduleItemCosts] = useState([])

  const getSorCodeObject = (value, index) => {
    if (sorCodeArrays[index]) {
      return sorCodeArrays[index].filter((a) => a.code == value)[0]
    }
  }

  const updateTotalCost = (rateScheduleItemCosts) => {
    setTotalCost(calculateTotal(rateScheduleItemCosts, 'cost', 'quantity'))
  }

  const onQuantityChange = (index, event) => {
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

  const onRateScheduleItemSelect = (index, code) => {
    document.getElementById('priorityCode').disabled = false

    const sorCodeObject = getSorCodeObject(code, index)

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

    const newItemIndex =
      arrayOfRateScheduleItemComponentIndexes.slice(-1)[0] + 1

    setArrayOfRateScheduleItemComponentIndexes(
      (arrayOfRateScheduleItemComponentIndexes) => [
        ...arrayOfRateScheduleItemComponentIndexes,
        newItemIndex,
      ]
    )

    const newSorArray = sorSearchRequest
      ? [] // will be populated on user input
      : sorCodeArrays[0] // each additional SOR will have the same options

    setSorCodeArrays((sorCodeArrays) => {
      sorCodeArrays[newItemIndex] = newSorArray

      return sorCodeArrays
    })
  }

  const removeRateScheduleItem = (index) => {
    setSorCodeArrays((sorCodeArrays) => {
      sorCodeArrays[index] = []

      return sorCodeArrays
    })

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
            sorCodes={
              sorSearchRequest ? sorCodeArrays[i] || [] : sorCodeArrays[0]
            }
            register={register}
            errors={errors}
            disabled={disabled}
            key={i}
            index={i}
            onRateScheduleItemChange={onRateScheduleItemSelect}
            onQuantityChange={onQuantityChange}
            showRemoveRateScheduleItem={i > 0}
            removeRateScheduleItem={removeRateScheduleItem}
            sorSearchRequest={sorSearchRequest}
            setSorCodes={(codes) =>
              setSorCodeArrays((sorCodeArrays) => [
                ...sorCodeArrays.slice(0, i),
                codes,
                ...sorCodeArrays.slice(i + 1),
              ])
            }
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
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  updatePriority: PropTypes.func.isRequired,
  getPriorityObjectByCode: PropTypes.func.isRequired,
}

export default RateScheduleItemView
