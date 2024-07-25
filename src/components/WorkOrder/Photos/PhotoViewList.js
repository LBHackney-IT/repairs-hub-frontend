import { format } from 'date-fns'
import PhotoListWithPreview from './PhotoListWithPreview'
import PhotoGroupDescriptionForm from './PhotoGroupDescriptionForm'

const PhotoViewList = ({ photos, onSubmitSetDescription = null }) => {
  // in case of error
  if (photos === null) return null

  return (
    <>
      <ul className="lbh-body-s photoViewList-ul">
        {photos.map((fileGroup) => {
          return (
            <li
              key={fileGroup.id}
              className="photoViewList-li"
              data-testid={`fileGroup-${fileGroup.id}`}
            >
              <hr className="govuk-section-break govuk-section-break--visible photoViewList-hr" />

              <>
                <div className="photoViewList-photoGroup">
                  <h3>{fileGroup.groupLabel}</h3>

                  <div className="govuk-!-margin-0">
                    {format(
                      new Date(fileGroup.timestamp),
                      'dd LLLL yyyy, HH:mm'
                    )}
                  </div>
                </div>
                <p className="govuk-!-margin-top-1">{fileGroup.uploadedBy}</p>

                <PhotoListWithPreview fileUrls={fileGroup.files} />
              </>

              {onSubmitSetDescription !== null && (
                <PhotoGroupDescriptionForm
                  id={fileGroup.id}
                  description={fileGroup.description}
                  onSubmitSetDescription={onSubmitSetDescription}
                />
              )}
            </li>
          )
        })}
      </ul>

      <hr className="govuk-section-break govuk-section-break--visible photoViewList-hr" />
    </>
  )
}

export default PhotoViewList
