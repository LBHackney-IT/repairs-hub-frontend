import { format } from 'date-fns'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

const PhotoViewList = ({ photos }) => {
  // in case of error
  if (photos === null) return null

  return (
    <>
      <ul className="lbh-body-s photoViewList-ul">
        {photos.map(({ files, groupLabel, id, timestamp, uploadedBy }) => {
          return (
            <li key={id} className="photoViewList-li">
              <hr className="govuk-section-break govuk-section-break--visible photoViewList-hr" />
              <PhotoGroup
                groupLabel={groupLabel}
                timestamp={timestamp}
                uploadedBy={uploadedBy}
                files={files}
              />
            </li>
          )
        })}
      </ul>

      <hr className="govuk-section-break govuk-section-break--visible photoViewList-hr" />
    </>
  )
}

const PhotoGroup = ({ groupLabel, timestamp, uploadedBy, files }) => {
  return (
    <>
      <div className="photoViewList-photoGroup">
        <h3>{groupLabel}</h3>

        <div className="govuk-!-margin-0">
          {format(new Date(timestamp), 'dd LLLL yyyy, HH:mm')}
        </div>
      </div>
      <p className="govuk-!-margin-0">{uploadedBy}</p>

      <PhotoProvider>
        <div className="photoViewList-photoGroupContainer">
          {files.map((x) => (
            <div className="photoViewList-photoGroupItem">
              <PhotoView src={x}>
                <img src={x} style={{ width: 'auto', height: '150px' }} />
              </PhotoView>
            </div>
          ))}
        </div>
      </PhotoProvider>
    </>
  )
}

export default PhotoViewList
