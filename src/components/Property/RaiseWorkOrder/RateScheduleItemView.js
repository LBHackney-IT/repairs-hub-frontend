import PropTypes from 'prop-types'
import { useState, Fragment, useEffect } from 'react'
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
  setPageToMultipleSORs,
  formState,
  enablePriorityField,
}) => {
  const [
    arrayOfRateScheduleItemComponentIndexes,
    setArrayOfRateScheduleItemComponentIndexes,
  ] = useState(sorCodeArrays.map((v, index) => index))

  useEffect(() => {
    if (arrayOfRateScheduleItemComponentIndexes.length > 1) {
      if (
        formState.rateScheduleItems?.length <
        arrayOfRateScheduleItemComponentIndexes.length
      ) {
        arrayOfRateScheduleItemComponentIndexes.pop()
      }
    }
  }, arrayOfRateScheduleItemComponentIndexes)

  const [rateScheduleItemPriorities, setRateScheduleItemPriorities] = useState(
    []
  )
  const [rateScheduleItemCosts, setRateScheduleItemCosts] = useState([])

  // The running total (which also drives the raise limit check) is built from
  // rateScheduleItemCosts, and that is only ever filled in by onQuantityChange,
  // i.e. when the user types in a Quantity input.
  //
  // Rows added on the "Add multiple SOR codes" page come back through formState
  // with a quantity already set (and rows entered before visiting that page are
  // restored the same way), so that change event never fires for them. Without
  // this, the input would show a quantity but the total and the raise limit
  // check would ignore the row until the user edited it.
  //
  // This seeds rateScheduleItemCosts from formState once on mount, which is
  // enough because formState only changes while this view is unmounted (the
  // multiple SORs page replaces it). It isn't ideal, as it duplicates state that
  // could be derived from the form values. Doing that properly would mean
  // reworking how this view tracks totals, so it is left as is.
  useEffect(() => {
    const initialCosts = (formState?.rateScheduleItems || [])
      .map((rsi, index) => ({
        index,
        cost: parseFloat(rsi.cost),
        quantity: parseFloat(rsi.quantity),
      }))
      .filter((c) => !isNaN(c.cost) && !isNaN(c.quantity))

    if (initialCosts.length > 0) {
      setRateScheduleItemCosts(initialCosts)
      updateTotalCost(initialCosts)
    }
  }, [])

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
    enablePriorityField()

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

      const sortedByPriorityCode = rateScheduleItemPriorities.sort(
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

  const changePageView = (e) => {
    e.preventDefault()
    setPageToMultipleSORs()
  }

  return (
    <div className="min-height-120 govuk-!-margin-bottom-6">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div>
            {arrayOfRateScheduleItemComponentIndexes.map((i) => (
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
            ))}
            {apiError && <ErrorMessage label={apiError} />}
          </div>
          <div>
            <a className="lbh-link" href="#" onClick={addRateScheduleItem}>
              + Add another SOR code
            </a>
          </div>
          <div>
            {!disabled && (
              <a className="lbh-link" href="#" onClick={changePageView}>
                + Add multiple SOR codes
              </a>
            )}
          </div>
        </>
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
  setPageToMultipleSORs: PropTypes.func.isRequired,
  enablePriorityField: PropTypes.func.isRequired,
}

export default RateScheduleItemView
