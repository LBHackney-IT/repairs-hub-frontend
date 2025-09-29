import { Dispatch, SetStateAction, useRef, useState, useEffect } from 'react'

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
import validateFileUpload from './hooks/validateFileUpload'
import useCloudwatchLogger from '@/root/src/utils/cloudwatchLogger'

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
  workOrderReference: string
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
    workOrderReference,
  } = props

  const inputRef = useRef<HTMLInputElement | null>(null)
  const [previewFiles, setPreviewFiles] = useState<File[]>([])

  const cwLogger = useCloudwatchLogger(
    'PHOTOS',
    `ControlledFileInput ${registerField || ''} | ${workOrderReference}`
  )

  useEffect(() => {
    // when form is reset e.g. due to an error - set the preview files from the files
    if (!files || files.length === 0) {
      setPreviewFiles([])
      return
    }
    // if there are files but no preview files (e.g. after a form reset), set them
    if (files.length > 0 && previewFiles.length === 0) {
      setPreviewFiles(files)
    }
  }, [])

  useUpdateFileInput({ files, setPreviewFiles, inputRef })

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
    const totalSizeKb = Math.round(
      selectedFiles.reduce((acc, file) => acc + file.size, 0) / 1024
    )
    cwLogger.log(
      `Selected ${selectedFiles.length} files with size ${totalSizeKb} KB`
    )

    // Immediately notify parent of all selected files for upload
    setFiles(selectedFiles)

    const stableFiles: File[] = []
    try {
      // Process files one-by-one to avoid memory spikes
      // Read each file into memory and create a stable copy away from the OS
      for (const file of selectedFiles) {
        const buffer = await file.arrayBuffer()
        const stableFile = new File([buffer], file.name, { type: file.type })
        stableFiles.push(stableFile)
      }
    } catch (err) {
      cwLogger.error(
        `Error creating stable file copies for ${registerField}: ${err}`
      )
      // On error, fallback to using the original selected files
      stableFiles.push(...selectedFiles)
    }

    try {
      for (const file of stableFiles) {
        try {
          if (await cachedFileExists(file)) {
            const cached = await getCachedFile(file)
            if (cached) {
              addFileIfNew(cached)
              continue
            }
          }
        } catch (err) {
          cwLogger.error(
            `Error retrieving cached file ${file.name} for preview: ${err}`
          )
        }

        // For new files, compress them before displaying
        try {
          const compressed = await compressFile(file)
          setCachedFile(compressed)
          addFileIfNew(compressed)
        } catch (error) {
          cwLogger.error(
            `Error compressing file ${file.name} for preview: ${error}`
          )
          // If compression fails, still add the original file
          addFileIfNew(file)
        }
      }
    } catch (err) {
      cwLogger.error(
        `Error processing files for preview for ${registerField}: ${err}`
      )
      // On error, fallback to adding stable files as-is
      stableFiles.forEach((file) => addFileIfNew(file))
    }
    cwLogger.log(`Set ${stableFiles.length} preview files`)
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
      {previewFiles.length < files.length && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SpinnerWithLabel
            label={`Caching photos... (${previewFiles.length} of ${files.length})`}
          />
        </div>
      )}
    </div>
  )
}

export default ControlledFileInput
