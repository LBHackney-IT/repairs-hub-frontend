import PhotoViewList from './Photos/PhotoViewList'

const MobileWorkingPhotoView = ({ photos }) => {
  return (
    <>
      <h2 className="lbh-heading-h2">Photos</h2>

      {/* Only show photos if there are any */}
      {photos.length > 0 && <PhotoViewList photos={photos} />}
    </>
  )
}

export default MobileWorkingPhotoView
