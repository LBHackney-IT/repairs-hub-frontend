import PropTypes from 'prop-types'
import BackButton from '../../Layout/BackButton/BackButton'
import { useState } from 'react'
import { Button } from '../../Form'

const SelectProcess = ({ reference, changeStage, completionTime, notes }) => {
  const handleSubmit = (formData) => {
    formData.preventDefault()

    //changeStage()
  }

  const clickEdit = () => {
    changeStage()
  }

  return (
    <div className="govuk-grid-column-two-thirds">
      <h1 className="govuk-heading-l govuk-!-margin-bottom-9 govuk-!-margin-top-3">
        Update work order: {reference.reference}{' '}
      </h1>
      <h2> Summary</h2>
      <div>
        <p>Completion time {completionTime.toString()}</p>
        <a onClick={clickEdit}>Edit</a>
      </div>
      <div>
        <p>Notes: {notes}</p>
        <a onClick={clickEdit}>Edit</a>
      </div>
    </div>
  )
}

SelectProcess.propTypes = {
  reference: PropTypes.string.isRequired,
  changeStage: PropTypes.func.isRequired,
  completionTime: PropTypes.instanceOf(Date).isRequired,
  notes: PropTypes.string.isRequired,
  changeStage: PropTypes.func.isRequired,
}

export default SelectProcess
