import { Dispatch, SetStateAction, useRef, useState, useEffect } from 'react'

import ErrorMessage from '../../Errors/ErrorMessage'
import PhotoUploadPreview from './PhotoUploadPreview'
import classNames from 'classnames'
import useUpdateFileInput from './hooks/useUpdateFileInput'
import {
  cachedFileExists,
  clearIndexedDb,
  getCachedFile,
  setCachedFile,
} from './hooks/uploadFiles/cacheFile'
import SpinnerWithLabel from '../../SpinnerWithLabel'
import compressFile from './hooks/uploadFiles/compressFile'
import validateFileUpload from './hooks/validateFileUpload'

interface Props {
  files: File[]
  setFiles: Dispatch<SetStateAction<File[]>>
  validationError: string
  isLoading: boolean
  label: string
  hint: string
  disabled?: boolean
  testId: string
  registerFunction?: CallableFunction
  registerField?: string
}

const ControlledFileInput = (props: Props) => {
  const {
    files,
    setFiles,
    validationError,
    isLoading,
    label,
    hint,
    disabled,
    testId,
    registerFunction,
    registerField,
  } = props

  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [totalFilesToCompress, setTotalFilesToCompress] = useState(0)
  const [processedCount, setProcessedCount] = useState(0)
  const [previewFiles, setPreviewFiles] = useState<File[]>([])

  // when form is reset e.g. due to an error - keep the files
  useEffect(() => {
    if (files.length > 0 && previewFiles.length === 0) {
      setPreviewFiles(files)
    }
  }, [])

  // remove preview files if file was removed - by name
  useEffect(() => {
    setPreviewFiles((prev) =>
      prev.filter((f) => files.some((file) => file.name === f.name))
    )
  }, [files])

  useEffect(() => {
    console.log('Current files:', files.length, 'Current preview files:', previewFiles.length)
  }, [files, previewFiles])

  useUpdateFileInput(inputRef, files)

  function addFileIfNew(file: File) {
    setFiles((prev) => {
      const fileExists = prev.some((p) => p.name === file.name)
      return fileExists ? prev : [...prev, file]
    })
    setPreviewFiles((prev) => {
      const fileExists = prev.some((p) => p.name === file.name)
      return fileExists ? prev : [...prev, file]
    })
  }

  const handleInput = async (e: React.FormEvent<HTMLInputElement>) => {
    setPreviewFiles([])
    const selectedFiles = Array.from(e.currentTarget.files || [])
    console.log(`Selected files count: ${selectedFiles.length}`)

    // Immediately notify parent of all selected files for upload
    setFiles(selectedFiles)

    // await clearIndexedDb(); // < FOR TESTING - REMOVE THIS!

    setIsCompressing(true)
    setTotalFilesToCompress(selectedFiles.length)
    setProcessedCount(0)

    try {
      const stableFiles: File[] = []
      // Process files one-by-one to avoid memory spikes
      // Read each file into memory and create a stable copy away from the OS
      for (const file of selectedFiles) {
        const buffer = await file.arrayBuffer()
        const stableFile = new File([buffer], file.name, { type: file.type })
        stableFiles.push(stableFile)
      }
      for (const file of stableFiles) {
        if (await cachedFileExists(file)) {
          const cached = await getCachedFile(file)
          if (cached) {
            addFileIfNew(cached)
            setProcessedCount((prev) => prev + 1)
            continue
          }
        }

        // For new files, compress them before displaying
        try {
          const compressed = await compressFile(file)
          setCachedFile(compressed)
          addFileIfNew(compressed)
        } catch (error) {
          console.error('Error compressing file:', error)
          // If compression fails, still add the original file
          addFileIfNew(file)
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
        style={{
          marginTop: '10px',
        }}
        onChange={handleInput}
        {...registerFunction?.(registerField, {
          validate: () => {
            const validation = validateFileUpload(files)

            if (validation === null) return true
            return validation
          },
        })}
      />

      <PhotoUploadPreview
        files={previewFiles}
        disabled={isLoading}
        setFiles={setFiles}
      />
      {isCompressing && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SpinnerWithLabel
            label={`Caching photos... (${processedCount} of ${totalFilesToCompress})`}
          />
        </div>
      )}
    </div>
  )
}

export default ControlledFileInput
