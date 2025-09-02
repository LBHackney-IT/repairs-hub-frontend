import { Dispatch, SetStateAction, useRef, useState } from 'react'

import ErrorMessage from '../../Errors/ErrorMessage'
import PhotoUploadPreview from './PhotoUploadPreview'
import classNames from 'classnames'
import useUpdateFileInput from './hooks/useUpdateFileInput'
import {
  cachedFileExists,
  getCachedFile,
  setCachedFile,
} from './hooks/uploadFiles/cacheFile'
import SpinnerWithLabel from '../../SpinnerWithLabel'
import compressFile from './hooks/uploadFiles/compressFile'

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
  onAllFilesSelected?: (files: File[]) => void
  onFileRemoved?: (files: File[]) => void
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
    onAllFilesSelected,
    onFileRemoved,
  } = props

  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [totalFilesToCompress, setTotalFilesToCompress] = useState(0)
  const [processedCount, setProcessedCount] = useState(0)

  useUpdateFileInput(inputRef, files)

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    // Create stable File objects immediately to prevent link severance
    const stableFiles: File[] = []
    for (const file of selectedFiles) {
      const buffer = await file.arrayBuffer()
      const stableFile = new File([buffer], file.name, { type: file.type })
      stableFiles.push(stableFile)
    }

    // Immediately notify parent of all selected files for upload
    onAllFilesSelected?.(stableFiles)

    setIsCompressing(true)
    setTotalFilesToCompress(stableFiles.length)
    setProcessedCount(0)
    setFiles([])

    try {
      // Process files one-by-one to avoid memory spikes
      for (const file of stableFiles) {
        if (await cachedFileExists(file)) {
          const cached = await getCachedFile(file)
          if (cached) {
            setFiles((prev) => [...prev, cached])
            setProcessedCount((prev) => prev + 1)
            continue
          }
        }

        // For new files, compress them before displaying
        try {
          const compressed = await compressFile(file)
          setCachedFile(compressed)
          setFiles((prev) => [...prev, compressed])
        } catch (error) {
          console.error('Error compressing file:', error)
          // If compression fails, still add the original file
          setFiles((prev) => [...prev, file])
        }
        setProcessedCount((prev) => prev + 1)
      }
    } catch (err) {
      console.error('Error processing files:', err)
    } finally {
      setIsCompressing(false)
    }
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
        <PhotoUploadPreview
          files={files}
          disabled={isLoading}
          setFiles={setFiles}
          onFileRemoved={onFileRemoved}
        />
        {isCompressing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <SpinnerWithLabel
              label={`Caching photos... (${processedCount} of ${totalFilesToCompress})`}
            />
          </div>
        )}
      </>
    </div>
  )
}

export default ControlledFileInput
