import PropTypes from 'prop-types'
import BackButton from '../Layout/BackButton/BackButton'
import { Button } from '../Form'
import { useState } from 'react'

const SelectProcess = ({ reference, changeStage }) => {
  const [selected_process, setSelectedprocess] = useState('')

  const handleSubmit = (formData) => {
    changeStage()
  }

  return (
    <div className="govuk-width-container">
      <BackButton />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-l govuk-!-margin-bottom-9 govuk-!-margin-top-3">
            Update work order: {reference.reference}{' '}
          </h1>
          <form
            className="govuk-form-group lbh-form-group"
            role="form"
            id="select-process"
            onSubmit={(formData) => handleSubmit(formData)}
          >
            <fieldset
              className="govuk-fieldset"
              aria-describedby="example-hint"
            >
              <legend className="govuk-fieldset__legend govuk-!-margin-bottom-6">
                Select process
              </legend>
              <div className="govuk-radios  lbh-radios">
                <div className="govuk-radios__item">
                  <input
                    className="govuk-radios__input"
                    id="example"
                    name="example"
                    type="radio"
                    value="yes"
                    checked={selected_process == 'var'}
                    onChange={() => setSelectedprocess('var')}
                  />
                  <label className="govuk-label govuk-radios__label">
                    Add a variation
                  </label>
                </div>
                <div className="govuk-radios__item">
                  <input
                    className="govuk-radios__input"
                    id="example-2"
                    name="example"
                    type="radio"
                    value="no"
                    checked={selected_process == 'close'}
                    onChange={() => setSelectedprocess('close')}
                  />
                  <label className="govuk-label govuk-radios__label govuk-!-margin-bottom-6">
                    Close job
                  </label>
                </div>
              </div>
            </fieldset>
            <Button label="Next" type="submit" />
          </form>
        </div>
      </div>
    </div>
  )
}

SelectProcess.propTypes = {
  reference: PropTypes.string.isRequired,
  changeStage: PropTypes.func.isRequired,
}

export default SelectProcess
