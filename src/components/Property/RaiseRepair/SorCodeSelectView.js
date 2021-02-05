import PropTypes from 'prop-types'
import { useState, Fragment } from 'react'
import SorCodeSelect from './SorCodeSelect'

const SorCodeSelectView = ({ sorCodes, register, errors }) => {
  const sorCodesList = sorCodes.map(
    (code) => `${code.customCode} - ${code.customName}`
  )
  const [
    arrayOfSorCodeSelectComponentIndexes,
    setArrayOfSorCodeSelectComponentIndexes,
  ] = useState([0])

  const onSorCodeSelect = (index, event) => {
    const value = event.target.value.split(' - ')[0]
    const sorCodeObject = sorCodes.filter((a) => a.customCode == value)[0]
    const sorCodeDescription = sorCodeObject?.customName || ''
    const sorCodeContractorRef = sorCodeObject?.sorContractor.reference || ''

    document.getElementById(
      `sorCodesCollection[${index}][description]`
    ).value = sorCodeDescription
    document.getElementById(
      `sorCodesCollection[${index}][contractorRef]`
    ).value = sorCodeContractorRef
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
  }

  const sorCodeSelectCollection = () => {
    return arrayOfSorCodeSelectComponentIndexes.map((i) => {
      return (
        <Fragment key={`sorCodeCollection~${i}`}>
          <SorCodeSelect
            sorCodesList={sorCodesList}
            register={register}
            errors={errors}
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
    <div className="govuk-!-padding-bottom-5">
      {sorCodeSelectCollection()}

      <a
        onClick={addSorCodeSelect}
        href="#"
        className="repairs-hub-link govuk-body-s"
      >
        + Add another SOR code
      </a>
    </div>
  )
}

SorCodeSelectView.propTypes = {
  sorCodes: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
}

export default SorCodeSelectView
