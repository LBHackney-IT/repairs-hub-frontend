import PropTypes from 'prop-types'
import { useState, Fragment } from 'react'
import RateScheduleItem from '../../WorkElement/RateScheduleItem'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import Spinner from '../../Spinner/Spinner'

const RateScheduleItemView = ({
  sorCodes,
  register,
  errors,
  disabled,
  updatePriority,
  getPriorityObjectByCode,
  loading,
  apiError,
}) => {
  const [
    arrayOfRateScheduleItemComponentIndexes,
    setArrayOfRateScheduleItemComponentIndexes,
  ] = useState([0])

  const [rateScheduleItemPriorities, setRateScheduleItemPriorities] = useState(
    []
  )

  const sorCodesList = sorCodes.map(
    (sorCode) => `${sorCode.code} - ${sorCode.shortDescription}`
  )

  const getSorCodeObject = (value) => {
    return sorCodes.filter((a) => a.code == value)[0]
  }

  const onRateScheduleItemSelect = (index, event) => {
    const value = event.target.value.split(' - ')[0]
    const sorCodeObject = getSorCodeObject(value)
    const sorCodeDescription = sorCodeObject?.shortDescription || ''

    document.getElementById(
      `rateScheduleItems[${index}][description]`
    ).value = sorCodeDescription

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

          <a
            onClick={addRateScheduleItem}
            href="#"
            className="repairs-hub-link govuk-body-s"
          >
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
