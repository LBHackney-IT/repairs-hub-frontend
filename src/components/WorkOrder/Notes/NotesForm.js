import PropTypes from 'prop-types'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { TextArea, Button } from '../../Form'
import { buildNoteFormData } from '../../../utils/hact/job-status-update/notes-form'

const NotesForm = ({ onFormSubmit, tabName, workOrderReference }) => {
  const { register, handleSubmit, errors } = useForm()
  const [displayNotesForm, setDisplayNotesForm] = useState(false)

  const onSubmit = async (formData) => {
    console.log(formData)
    const notesFormData = buildNoteFormData(formData)
    console.log(notesFormData)

    onFormSubmit(notesFormData)
  }

  const showNotesForm = (e) => {
    e.preventDefault()

    setDisplayNotesForm(true)
  }

  return (
    <>
      <div className="govuk-!-margin-bottom-6">
        <h2 className="govuk-heading-l display-inline govuk-!-margin-right-6">
          {tabName}
        </h2>
        {!displayNotesForm && (
          <div className="display-inline">
            <a
              onClick={showNotesForm}
              href="#"
              className="repairs-hub-link govuk-body-s"
            >
              Add a new note
            </a>
          </div>
        )}
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          {displayNotesForm && (
            <form role="form" id="notes-form" onSubmit={handleSubmit(onSubmit)}>
              <TextArea
                name="note"
                label="Note"
                placeholder="Write a new note..."
                required={true}
                register={register({
                  required: 'Please enter a note',
                  maxLength: {
                    value: 2000,
                    message:
                      'You have exceeded the maximum amount of 2000 characters',
                  },
                })}
                error={errors && errors.note}
              />
              <input
                id="workOrderReference"
                name="workOrderReference"
                label="workOrderReference"
                type="hidden"
                value={workOrderReference}
                ref={register}
              />

              <Button label="Publish note" type="submit" />
            </form>
          )}
        </div>
      </div>
    </>
  )
}

NotesForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  tabName: PropTypes.string.isRequired,
  workOrderReference: PropTypes.string.isRequired,
}

export default NotesForm
