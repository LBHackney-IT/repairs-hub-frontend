import { useEffect, useRef } from 'react'

import ErrorMessage from '../../Errors/ErrorMessage'
import PhotoUploadPreview from './PhotoUploadPreview'
import classNames from 'classnames'

const ControlledFileInput = ({
  files,
  setFiles,
  validationError,
  isLoading,
  register,
  disabled = false,
}) => {
  const inputRef = useRef()

  useEffect(() => {
    if (files.length === 0) {
      inputRef.current.value = ''
      return
    }

    const dataTransfer = new DataTransfer()

    files.forEach((file) => {
      dataTransfer.items.add(file)
    })

    inputRef.current.files = dataTransfer.files
  }, [files])

  return (
    <>
      <label
        className="govuk-label"
        htmlFor="fileUpload"
        style={{ marginTop: '10px' }}
      >
        Upload a photo (maximum 10)
      </label>
      {validationError && <ErrorMessage label={validationError} />}
      <input
        disabled={disabled}
        ref={inputRef}
        name="fileUpload"
        data-testid="fileUploadInput"
        className={classNames('govuk-file-upload custom-file-input', {
          'govuk-form-group--error': validationError,
        })}
        type="file"
        multiple
        accept=".jpg, .jpeg, .png"
        onInput={(e) => {
          setFiles(Object.values(e.target.files))
        }}
        style={{
          marginTop: '10px',
        }}
        {...register}
      />

      <>
        {files.length > 0 && (
          <PhotoUploadPreview
            files={files}
            disabled={isLoading}
            setFiles={setFiles}
          />
        )}
      </>
    </>
  )
}

export default ControlledFileInput
