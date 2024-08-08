import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import PropTypes from 'prop-types'

const PhotoListWithPreview = ({ fileUrls }) => {
  return (
    <PhotoProvider>
      <div className="photoViewList-photoGroupContainer">
        {fileUrls.map((fileUrl) => (
          <div className="photoViewList-photoGroupItem" key={fileUrl}>
            <PhotoView src={fileUrl}>
              <img src={fileUrl} style={{ width: 'auto', height: '150px' }} />
            </PhotoView>
          </div>
        ))}
      </div>
    </PhotoProvider>
  )
}

PhotoListWithPreview.propTypes = {
  fileUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default PhotoListWithPreview
