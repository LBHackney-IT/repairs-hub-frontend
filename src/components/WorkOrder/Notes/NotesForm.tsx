import { useForm } from 'react-hook-form'
import { TextArea, PrimarySubmitButton } from '../../Form'
import { buildNoteFormData } from '@/utils/hact/jobStatusUpdate/notesForm'

interface Props {
  onFormSubmit: (...args: any[]) => any
  tabName: string
  workOrderReference: string
  displayForm: boolean
  showForm: (...args: any[]) => any
}

const NotesForm = ({
  onFormSubmit,
  tabName,
  workOrderReference,
  displayForm,
  showForm,
}: Props) => {
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

export default NotesForm
