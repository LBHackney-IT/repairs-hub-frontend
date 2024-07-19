import { format } from 'date-fns'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

const PhotoViewList = ({ images }) => {
  return (
    <>
      <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

      <ul
        className="lbh-body-s "
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {images.map(({ files, groupLabel, id, timestamp, uploadedBy }) => {
          return (
            <li
              key={id}
              style={{
                display: 'block',

                marginTop: '0px',
                padding: '15px 0',
              }}
            >
              <PhotoGroup
                groupLabel={groupLabel}
                timestamp={timestamp}
                uploadedBy={uploadedBy}
                files={files}
              />
              <hr
                className="govuk-section-break govuk-section-break--l govuk-section-break--visible"
                style={{ marginBottom: '0px' }}
              />
            </li>
          )
        })}
      </ul>
    </>
  )
}

const PhotoGroup = ({ groupLabel, timestamp, uploadedBy, files }) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3>{groupLabel}</h3>

        <div style={{ marginTop: 0 }}>
          {format(new Date(timestamp), 'dd LLLL yyyy, HH:mm')}
        </div>
      </div>
      <p style={{ marginTop: 0 }}>{uploadedBy}</p>

      <PhotoProvider>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 'calc(-15px + 30px)',
            marginLeft: '-15px',
          }}
        >
          {files.map((x) => (
            <div style={{ marginTop: '15px', marginLeft: '15px' }}>
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
