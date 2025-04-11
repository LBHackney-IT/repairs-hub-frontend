import { Dispatch, SetStateAction } from 'react'

interface Props {
  files: File[]
  setFiles: Dispatch<SetStateAction<File[]>>
  disabled: boolean
}

const PhotoUploadPreview = (props: Props) => {
  const { files, setFiles, disabled = false } = props

  return (
    <div className="photoUploadPreview">
      {files.map((x, index) => (
        <div
          key={x.name}
          className="photoUploadPreview-container"
        >
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
            disabled={disabled}
            onClick={() => {
              if (disabled) return

              setFiles((prevFiles: File[]) => {
                const newArr = [...prevFiles]
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
