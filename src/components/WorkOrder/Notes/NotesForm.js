import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { TextArea, PrimarySubmitButton } from '../../Form'
import { buildNoteFormData } from '@/utils/hact/jobStatusUpdate/notesForm'

const NotesForm = ({
  onFormSubmit,
  tabName,
  workOrderReference,
  displayForm,
  showForm,
}) => {
  const { register, handleSubmit, errors } = useForm()

  const onSubmit = async (formData) => {
    const notesFormData = buildNoteFormData(formData)

    onFormSubmit(notesFormData)
  }

  return (
    <>
      <div className="govuk-!-margin-bottom-6">
        <h2 className="lbh-heading-h2 display-inline govuk-!-margin-right-6">
          {tabName}
        </h2>
        {!displayForm && (
          <div className="display-inline">
            <a className="lbh-link" href="#" onClick={showForm}>
              Add a new note
            </a>
          </div>
        )}
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          {displayForm && (
            <form role="form" id="notes-form" onSubmit={handleSubmit(onSubmit)}>
              <TextArea
                name="note"
                label="Note"
                placeholder="Write a new note..."
                required={true}
                register={register({
                  required: 'Please enter a note',
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

              <PrimarySubmitButton
                id="submit-note-create"
                label="Publish note"
              />
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
  displayForm: PropTypes.bool.isRequired,
  showForm: PropTypes.func.isRequired,
}

export default NotesForm
