import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'

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
  const [previewFiles, setPreviewFiles] = useState<File[]>([])

  useUpdateFileInput(inputRef, files)

  useEffect(() => {
    const neededFiles = files.filter(
      (file) => !previewFiles.some((pf) => pf.name === file.name)
    )
    setPreviewFiles((prev) => [...prev, ...neededFiles])
  }, [files, previewFiles])

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    setFiles([])
    setPreviewFiles([])
    setIsCompressing(true)
    setTotalFilesToCompress(selectedFiles.length)
    setCompressedCount(0)

    try {
      const stableFiles: File[] = []

      // Process files one-by-one to avoid memory spikes
      // Read each file into memory and create a stable copy away from the OS
      for (const file of selectedFiles) {
        const buffer = await file.arrayBuffer()
        const stableFile = new File([buffer], file.name, { type: file.type })
        stableFiles.push(stableFile)
      }
      setFiles(stableFiles)

      for (const file of stableFiles) {
        if (await cachedFileExists(file)) {
          const cached = await getCachedFile(file)
          if (cached) {
            console.log('File already cached, skipping compression:', file.name)
            setPreviewFiles((prev) => [...prev, cached])
            setCompressedCount((prevCount) => prevCount + 1)
            continue
          }
        }
        try {
          const compressed = await compressFile(file)
          setCachedFile(compressed)
          setPreviewFiles((prev) => [...prev, compressed])
        } catch (error) {
          console.error('Error compressing file:', error)
          setCachedFile(file)
          setPreviewFiles((prev) => [...prev, file])
        }
        setCompressedCount((prevCount) => prevCount + 1)
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
        {previewFiles.length > 0 && (
          <>
            <PhotoUploadPreview
              files={previewFiles}
              disabled={isLoading}
              setFiles={(newPreviewFiles: File[]) => {
                setPreviewFiles(newPreviewFiles)
                const keepNames = new Set(newPreviewFiles.map((f) => f.name))
                const newFormFiles = files.filter((f) => keepNames.has(f.name))
                setFiles(newFormFiles)
              }}
            />
          </>
        )}
        {isCompressing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <SpinnerWithLabel
              label={`Caching photos... (${compressedCount} of ${totalFilesToCompress})`}
            />
          </div>
        )}
      </>
    </div>
  )
}

export default ControlledFileInput
