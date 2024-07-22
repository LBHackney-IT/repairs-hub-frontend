const PhotoUploadPreview = ({ files, isUploading, setFiles }) => {
  return (
    <div className="photoUploadPreview">
      {files.map((x, index) => (
        <div key={x.name} className="photoUploadPreview-container">
          <div className="photoUploadPreview-imageContainer">
            <img
              className="photoUploadPreview-image"
              src={URL.createObjectURL(x)}
              alt="Preview Uploaded Image"
              id="file-preview"
            />
          </div>

          <button
            className="photoUploadPreview-removeButton"
            type="button"
            onClick={() => {
              if (isUploading) return
              setFiles((files) => {
                var newArr = [...files]
                newArr.splice(index, 1)
                return newArr
              })
            }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}

export default PhotoUploadPreview
