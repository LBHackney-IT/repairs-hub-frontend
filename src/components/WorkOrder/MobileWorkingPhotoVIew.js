import PhotoViewList from './Photos/PhotoViewList'

const MobileWorkingPhotoView = ({ photos }) => {
  return (
    <>
      <h2 className="lbh-heading-h2">Photos</h2>

      <PhotoViewList photos={photos} />
    </>
  )
}

export default MobileWorkingPhotoView
