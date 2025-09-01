import { Dispatch, SetStateAction } from 'react'

interface Props {
  files: File[]
  setFiles: Dispatch<SetStateAction<File[]>>
  disabled: boolean
  onFileRemoved?: (files: File[]) => void
}

const PhotoUploadPreview = (props: Props) => {
  const { files, setFiles, disabled = false, onFileRemoved } = props

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

              const newArr = [...files]
              if (index >= 0 && index < newArr.length) {
                newArr.splice(index, 1)
              }
              setFiles(newArr)
              onFileRemoved?.(newArr)
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
