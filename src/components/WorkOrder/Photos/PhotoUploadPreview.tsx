import { Dispatch, SetStateAction } from 'react'

interface Props {
  files: File[]
  setFiles: Dispatch<SetStateAction<File[]>>
  disabled: boolean
}

const PhotoUploadPreview = (props: Props) => {
  const { files, setFiles, disabled = false } = props

  if (files.length === 0) return null

  return (
    <div className="photoUploadPreview">
      {files.map((file, index) => (
        <div key={file.name} className="photoUploadPreview-container">
          <div className="photoUploadPreview-imageContainer">
            <img
              className="photoUploadPreview-image"
              src={URL.createObjectURL(file)}
              alt="Preview Uploaded Image"
              id="file-preview"
            />
          </div>
          <p className="photoUploadPreview-filename">{file.name}</p>
          <button
            className="photoUploadPreview-removeButton"
            type="button"
            disabled={disabled}
            onClick={() => {
              if (disabled) return
              setFiles((files) => files.filter((f) => f.name !== file.name))
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
