import PhotoListWithPreview from './PhotoListWithPreview'
import PhotoGroupDescriptionForm from './PhotoGroupDescriptionForm'
import { formatDateTime } from '@/root/src/utils/time'

const PhotoViewList = ({ photos, onSubmitSetDescription = null }) => {
  // in case of error
  if (photos === null) return null

  return (
    <>
      <ul className="lbh-body-s photoViewList-ul">
        {photos.map((fileGroup) => (
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
                  {formatDateTime(fileGroup.timestamp)}
                </div>
              </div>
              <p className="govuk-!-margin-top-1">{fileGroup.uploadedBy}</p>

              <PhotoListWithPreview fileUrls={fileGroup.files} />
            </>

            {onSubmitSetDescription !== null ? (
              <PhotoGroupDescriptionForm
                id={fileGroup.id}
                description={fileGroup.description}
                onSubmitSetDescription={onSubmitSetDescription}
              />
            ) : (
              <>
                {fileGroup.description !== null &&
                  fileGroup.description !== '' && (
                    <p style={{ color: '#666', marginTop: '15px' }}>
                      {fileGroup.description}
                    </p>
                  )}
              </>
            )}
          </li>
        ))}
      </ul>

      <hr className="govuk-section-break govuk-section-break--visible photoViewList-hr" />
    </>
  )
}

export default PhotoViewList
