import PropTypes from 'prop-types'
import { useState, Fragment } from 'react'
import SorCodeSelect from './SorCodeSelect'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import Spinner from '../../Spinner/Spinner'

const SorCodeSelectView = ({
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
    arrayOfSorCodeSelectComponentIndexes,
    setArrayOfSorCodeSelectComponentIndexes,
  ] = useState([0])

  const [sorCodeObjects, setSorCodeObjects] = useState([])

  const sorCodesList = sorCodes.map(
    (sorCode) => `${sorCode.code} - ${sorCode.shortDescription}`
  )

  const getSorCodeObject = (value) => {
    return sorCodes.filter((a) => a.code == value)[0]
  }

  const onSorCodeSelect = (index, event) => {
    const value = event.target.value.split(' - ')[0]
    const sorCodeObject = getSorCodeObject(value)

    const sorCodeDescription = sorCodeObject?.shortDescription || ''

    document.getElementById(
      `sorCodesCollection[${index}][description]`
    ).value = sorCodeDescription

    if (sorCodeObject?.priority?.priorityCode) {
      const sorCodeObjectAtSameIndex = sorCodeObjects.find(
        (e) => e.index === index
      )

      if (sorCodeObjectAtSameIndex) {
        sorCodeObjectAtSameIndex.code = sorCodeObject.priority.priorityCode
      } else {
        setSorCodeObjects((sorCodeObjects) => [
          ...sorCodeObjects,
          {
            index: index,
            code: sorCodeObject.priority.priorityCode,
          },
        ])
      }

      let sortedByPriorityCode = sorCodeObjects.sort((a, b) => a.code - b.code)
      const existingHigherPriority = sortedByPriorityCode.find(
        (e) => e.code <= sorCodeObject.priority.priorityCode
      )

      updatePriority(
        sorCodeObject.priority.description,
        sorCodeObject.priority.priorityCode,
        sorCodeObjects.length,
        existingHigherPriority?.code
      )
    }
  }

  const addSorCodeSelect = (e) => {
    e.preventDefault()

    setArrayOfSorCodeSelectComponentIndexes(
      (arrayOfSorCodeSelectComponentIndexes) => [
        ...arrayOfSorCodeSelectComponentIndexes,
        arrayOfSorCodeSelectComponentIndexes.slice(-1)[0] + 1,
      ]
    )
  }

  const removeSorCodeSelect = (index) => {
    setArrayOfSorCodeSelectComponentIndexes(
      (arrayOfSorCodeSelectComponentIndexes) =>
        arrayOfSorCodeSelectComponentIndexes.filter((i) => i !== index)
    )

    const remainingSorCodeObjects = sorCodeObjects.filter(
      (i) => i.index !== index
    )

    setSorCodeObjects(remainingSorCodeObjects)

    if (remainingSorCodeObjects.length > 0) {
      const highestPriorityCode = Math.min(
        ...remainingSorCodeObjects.map((object) => object.code)
      )
      const priorityObject = getPriorityObjectByCode(highestPriorityCode)

      priorityObject &&
        updatePriority(
          priorityObject.description,
          priorityObject.priorityCode,
          remainingSorCodeObjects.length,
          highestPriorityCode
        )
    }
  }

  const sorCodeSelectCollection = () => {
    return arrayOfSorCodeSelectComponentIndexes.map((i) => {
      return (
        <Fragment key={`sorCodeCollection~${i}`}>
          <SorCodeSelect
            sorCodesList={sorCodesList}
            register={register}
            errors={errors}
            disabled={disabled}
            key={i}
            index={i}
            onSorCodeSelect={onSorCodeSelect}
            showRemoveSorCodeSelect={i > 0}
            removeSorCodeSelect={removeSorCodeSelect}
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
          {sorCodeSelectCollection()}
          {apiError && <ErrorMessage label={apiError} />}

          <a
            onClick={addSorCodeSelect}
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

SorCodeSelectView.propTypes = {
  sorCodes: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  updatePriority: PropTypes.func.isRequired,
  getPriorityObjectByCode: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  apiError: PropTypes.bool,
}

export default SorCodeSelectView
