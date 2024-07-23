import { format } from 'date-fns'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { PrimarySubmitButton, TextArea } from '../../Form'

const PhotoViewList = ({ photos, onSubmitSetDescription }) => {
  // in case of error
  if (photos === null) return null

  return (
    <>
      <ul className="lbh-body-s photoViewList-ul">
        {photos.map((fileGroup) => {
          return (
            <li key={fileGroup.id} className="photoViewList-li">
              <hr className="govuk-section-break govuk-section-break--visible photoViewList-hr" />
              <PhotoGroup
                fileGroup={fileGroup}
                onSubmitSetDescription={onSubmitSetDescription}
              />
            </li>
          )
        })}
      </ul>

      <hr className="govuk-section-break govuk-section-break--visible photoViewList-hr" />
    </>
  )
}

const UpdateDescriptionButton = ({ showForm, description }) => {
  const groupHasDescription = description !== null && description !== ''

  return (
    <div className="display-inline">
      {groupHasDescription && (
        <p style={{ color: '#666', marginTop: '15px' }}>{description}</p>
      )}

      <button
        type="button"
        className="lbh-link"
        onClick={showForm}
        style={{
          marginTop: '15px',
        }}
      >
        {groupHasDescription ? 'Edit' : 'Add'} description
      </button>
    </div>
  )
}

const UpdateDescriptionForm = ({ description, onSubmit, fileGroupId }) => {
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
            placeholder="Add a description"
            required={true}
            register={register({
              required: 'Please enter a note',
            })}
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
            label={`${groupHasDescription ? 'Edit' : 'Add'} description`}
          />
        </form>
      </div>
    </div>
  )
}

const PhotoGroup = ({ fileGroup, onSubmitSetDescription }) => {
  const {
    files: fileUrls,
    groupLabel,
    id,
    timestamp,
    uploadedBy,
    description,
  } = fileGroup

  const [displayForm, setDisplayForm] = useState(false)

  const onSubmit = async (formData) => {
    const requestBody = {
      fileGroupId: formData.fileGroupId,
      description: formData.description,
    }

    await onSubmitSetDescription(requestBody)
  }

  const showForm = () => {
    setDisplayForm(true)
  }

  return (
    <>
      <div className="photoViewList-photoGroup">
        <h3>{groupLabel}</h3>

        <div className="govuk-!-margin-0">
          {format(new Date(timestamp), 'dd LLLL yyyy, HH:mm')}
        </div>
      </div>
      <p className="govuk-!-margin-0">{uploadedBy}</p>

      <PhotoListWithPreview fileUrls={fileUrls} />

      {displayForm ? (
        <UpdateDescriptionForm
          description={description}
          onSubmit={onSubmit}
          fileGroupId={id}
        />
      ) : (
        <UpdateDescriptionButton
          description={description}
          showForm={showForm}
        />
      )}
    </>
  )
}

export const PhotoListWithPreview = ({ fileUrls }) => {
  return (
    <PhotoProvider>
      <div className="photoViewList-photoGroupContainer">
        {fileUrls.map((x) => (
          <div className="photoViewList-photoGroupItem">
            <PhotoView src={x}>
              <img src={x} style={{ width: 'auto', height: '150px' }} />
            </PhotoView>
          </div>
        ))}
      </div>
    </PhotoProvider>
  )
}

export default PhotoViewList
