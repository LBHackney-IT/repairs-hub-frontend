import { Dispatch, SetStateAction, useRef } from 'react'

import ErrorMessage from '../../Errors/ErrorMessage'
import PhotoUploadPreview from './PhotoUploadPreview'
import classNames from 'classnames'
import useUpdateFileInput from './hooks/useUpdateFileInput'

interface Props {
  files: File[]
  setFiles: Dispatch<SetStateAction<File[]>>
  validationError: string
  isLoading: boolean
  register: any
  label: string
  hint: string
  disabled?: boolean
  testId: string
}

const ControlledFileInput = (props: Props) => {
  const {
    files,
    setFiles,
    validationError,
    isLoading,
    register,
    label,
    hint,
    disabled = false,
    testId,
  } = props

  const inputRef = useRef()

  // extracted to enable mocking
  useUpdateFileInput(files, inputRef)

  return (
    <div>
      <legend
        id="fileUploadLegend"
        className={`govuk-fieldset__legend govuk-fieldset__legend--s`}
      >
        {label}
      </legend>

      <span id="photos-hint" className="govuk-hint lbh-hint">
        {hint}
      </span>

      {validationError && <ErrorMessage label={validationError} />}
      <input
        disabled={disabled}
        ref={inputRef}
        name="fileUpload"
        id="fileUpload"
        aria-labelledby="fileUploadLegend"
        data-testid={testId}
        className={classNames('govuk-file-upload custom-file-input', {
          'govuk-form-group--error': validationError,
        })}
        type="file"
        multiple
        accept=".jpg, .jpeg, .png"
        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
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
