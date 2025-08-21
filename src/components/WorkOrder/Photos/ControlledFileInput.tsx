import { Dispatch, SetStateAction, useRef, useState } from 'react'

import ErrorMessage from '../../Errors/ErrorMessage'
import PhotoUploadPreview from './PhotoUploadPreview'
import classNames from 'classnames'
import useUpdateFileInput from './hooks/useUpdateFileInput'
import { getCachedFile, setCachedFile } from './hooks/uploadFiles/cacheFile'
import { compressFile } from './hooks/uploadFiles/compressFile'
import SpinnerWithLabel from '../../SpinnerWithLabel'
import ensureAllFilesReadable from './hooks/uploadFiles/ensureAllFilesReadable'

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

  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressedCount, setCompressedCount] = useState(0)
  const [totalFilesToCompress, setTotalFilesToCompress] = useState(0)

  useUpdateFileInput(files, inputRef)

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Object.values(e.target.files || []) as File[]

    if (selectedFiles.length === 0) {
      setFiles([])
      return
    }

    // show previews immediately using the original selected files
    setFiles(selectedFiles)

    // compress/cache in background and then replace previews with compressed files
    setIsCompressing(true)
    setCompressedCount(0)
    setTotalFilesToCompress(selectedFiles.length)

    const processedFiles: File[] = []

    // ensure all files are readable
    await ensureAllFilesReadable(selectedFiles)

    for (const file of selectedFiles) {
      setCompressedCount(processedFiles.length)

      // if file is already cached, use the cached file
      try {
        const cached = await getCachedFile(file)
        if (cached) {
          processedFiles.push(cached)
          continue
        }
      } catch (err) {
        console.error(
          'Error reading cached file, attempting to re-compress original file:',
          file.name,
          err
        )
      }

      // if the file is not already cached, compress and cache it
      try {
        const compressed = await compressFile(file)
        processedFiles.push(compressed)
        await setCachedFile(compressed)
      } catch (err) {
        console.error(
          'Compression failed, using original file:',
          file.name,
          err
        )
        processedFiles.push(file)
      }
    }

    // replace previews with compressed/cached files once ready
    setFiles(processedFiles)
    setIsCompressing(false)

    setTotalFilesToCompress(0)
    setCompressedCount(0)
  }

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
        onInput={handleInput}
        style={{
          marginTop: '10px',
        }}
        {...register}
      />

      <>
        {files.length > 0 && (
          <>
            <PhotoUploadPreview
              files={files}
              disabled={isLoading}
              setFiles={setFiles}
            />
            {isCompressing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <SpinnerWithLabel
                  label={`Compressing photos... (${compressedCount} of ${totalFilesToCompress})`}
                />
              </div>
            )}
          </>
        )}
      </>
    </div>
  )
}

export default ControlledFileInput
