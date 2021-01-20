import PropTypes from 'prop-types'
import Summary from './Summary'
import BackButton from '../../Layout/BackButton/BackButton'
import TextArea from '../../Form/TextArea/TextArea'
import { useState } from 'react'
import { Button } from '../../Form'
import moment from 'moment'

const SelectProcess = ({ reference, changeStage }) => {
  const [onSummaryPage, setOnSummaryPage] = useState(false)
  const [selected_process, setSelectedprocess] = useState('')
  const [completionTime, setCompletionTime] = useState(null)
  const [notes, setNotes] = useState('')
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (formData) => {
    formData.preventDefault()
    let date = new moment(`${year}-${month}-${day}`, 'YYYY-MM-DD', true)
    if (!date.isValid()) {
      setError('Wrong date. Format is YYYY MM DD')
      return
    }

    setCompletionTime(
      new Date(year, parseInt(month) - 1, day, hours, minutes, 0, 0)
    )
    console.log(completionTime)
    setOnSummaryPage(true)

    //changeStage()
  }

  const onKeyUp = (event) => {
    setNotes(event.target.value)
  }

  const onChangeStage = () => {
    setOnSummaryPage(false)
  }

  return (
    <>
      {!onSummaryPage && (
        <div className="govuk-width-container">
          <BackButton />
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <h1 className="govuk-heading-l govuk-!-margin-bottom-9 govuk-!-margin-top-3">
                Update work order: {reference}{' '}
              </h1>
            </div>
            <form
              className="govuk-form-group lbh-form-group"
              role="form"
              id="select-process"
              onSubmit={(formData) => handleSubmit(formData)}
            >
              <span id="input-width-2-hint" className="govuk-hint  lbh-hint">
                Completion date
              </span>
              <input
                className="govuk-input govuk-input--width-2 lbh-input"
                id="day"
                name="test-width-2"
                type="text"
                defaultValue={day}
                aria-describedby="input-width-2-hint"
                onKeyUp={(e) => setDay(e.target.value)}
              />
              <input
                className="govuk-input govuk-input--width-2 lbh-input"
                id="month"
                name="test-width-2"
                type="text"
                defaultValue={month}
                aria-describedby="input-width-2-hint"
                onKeyUp={(e) => setMonth(e.target.value)}
              />
              <input
                className="govuk-input govuk-input--width-5 lbh-input"
                id="year"
                name="test-width-2"
                type="text"
                defaultValue={year}
                aria-describedby="input-width-2-hint"
                onKeyUp={(e) => setYear(e.target.value)}
              />

              <span id="input-width-2-hint" className="govuk-hint  lbh-hint">
                Completion time
              </span>
              <input
                className="govuk-input govuk-input--width-2 lbh-input"
                id="hours"
                name="test-width-2"
                type="text"
                defaultValue={hours}
                aria-describedby="input-width-2-hint"
                onKeyUp={(e) => setHours(e.target.value)}
              />
              <input
                className="govuk-input govuk-input--width-2 lbh-input"
                id="minutes"
                name="test-width-2"
                type="text"
                defaultValue={minutes}
                aria-describedby="input-width-2-hint"
                onKeyUp={(e) => setMinutes(e.target.value)}
              />

              <TextArea name="pepito" onKeyUp={onKeyUp} defaultValue={notes} />
              {error.length != 0 ? error : ''}
              <Button label="Next" type="submit" />
            </form>
          </div>
        </div>
      )}
      {onSummaryPage && (
        <Summary
          completionTime={completionTime}
          notes={notes}
          reference={reference}
          changeStage={onChangeStage}
        />
      )}
    </>
  )
}

SelectProcess.propTypes = {
  reference: PropTypes.string.isRequired,
  changeStage: PropTypes.func.isRequired,
}

export default SelectProcess
