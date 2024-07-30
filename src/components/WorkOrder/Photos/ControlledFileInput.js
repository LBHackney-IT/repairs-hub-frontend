import { useRef } from 'react'

import ErrorMessage from '../../Errors/ErrorMessage'
import PhotoUploadPreview from './PhotoUploadPreview'
import classNames from 'classnames'
import useUpdateFileInput from './hooks/useUpdateFileInput'

const ControlledFileInput = ({
  files,
  setFiles,
  validationError,
  isLoading,
  register,
  label = 'Photos',
  labelSize = 's',
  disabled = false,
  showAsOptional = false,
}) => {
  const inputRef = useRef()

  // extracted to enable mocking
  useUpdateFileInput(files, inputRef)

  return (
    <div>
      <legend
        className={`govuk-fieldset__legend govuk-fieldset__legend--${labelSize}`}
      >
        {label} {showAsOptional && '(optional) '}
      </legend>

      <span id={`${'photos'}-hint`} className="govuk-hint lbh-hint">
        Select all the photos you want to add (up to 10 photos)
      </span>

      {validationError && <ErrorMessage label={validationError} />}
      <input
        disabled={disabled}
        ref={inputRef}
        name="fileUpload"
        id="fileUpload"
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
    </div>
  )
}

export default ControlledFileInput
