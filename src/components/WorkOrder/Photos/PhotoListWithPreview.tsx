import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

interface Props {
  fileUrls: string[]
}

const PhotoListWithPreview = ({ fileUrls }: Props) => {
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

export default PhotoListWithPreview
