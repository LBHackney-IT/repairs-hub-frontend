import { useForm } from 'react-hook-form'
import { PrimarySubmitButton, TextArea } from '../../Form'
import { useState } from 'react'

const PhotoGroupDescriptionForm = ({
  description,
  id,
  onSubmitSetDescription,
}) => {
  const [displayForm, setDisplayForm] = useState(false)

  const showForm = () => {
    setDisplayForm(true)
  }

  const onSubmit = async (formData) => {
    const requestBody = {
      fileGroupId: formData.fileGroupId,
      description: formData.description ?? '',
    }

    await onSubmitSetDescription(requestBody)
  }

  if (displayForm) {
    return (
      <UpdateDescriptionForm
        description={description}
        onSubmit={onSubmit}
        fileGroupId={id}
      />
    )
  }

  return (
    <UpdateDescriptionButton
      description={description}
      showForm={showForm}
    />
  )
}

export const UpdateDescriptionButton = ({ showForm, description }) => {
  const groupHasDescription = description !== null && description !== ''

  return (
    <div className="display-inline">
      {groupHasDescription && (
        <p style={{ color: '#666', marginTop: '15px' }}>{description}</p>
      )}

      <button
        type="button"
        className="lbh-link updateDescriptionButton"
        onClick={showForm}
      >
        {groupHasDescription ? 'Edit' : 'Add'} description
      </button>
    </div>
  )
}

export const UpdateDescriptionForm = ({
  description,
  onSubmit,
  fileGroupId,
}) => {
  const { register, handleSubmit, errors } = useForm()

  const groupHasDescription = description !== null && description !== ''

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <form
          role="form"
          id="description-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextArea
            name="description"
            label="Description"
            defaultValue={description ?? ''}
            register={register()}
            error={errors && errors.description}
          />
          <input
            id="fileGroupId"
            name="fileGroupId"
            label="fileGroupId"
            type="hidden"
            value={fileGroupId}
            ref={register}
          />

          <PrimarySubmitButton
            label={`${groupHasDescription ? 'Save' : 'Add'} description`}
          />
        </form>
      </div>
    </div>
  )
}

export default PhotoGroupDescriptionForm
