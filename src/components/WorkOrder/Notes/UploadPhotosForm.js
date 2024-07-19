import { useEffect, useRef } from 'react'
import Spinner from '../../Spinner'

import { Button } from '../../Form'
import ErrorMessage from '../../Errors/ErrorMessage'
import PhotoUploadPreview from './PhotoUploadPreview'
import useFileUpload from './useFileUpload'

const UploadPhotosForm = ({ workOrderReference, onSuccess }) => {
  const {
    files,
    handleSubmit,
    uploadSuccess,
    setFiles,
    validationError,
    isUploading,
    requestError,
  } = useFileUpload(workOrderReference, onSuccess)

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
      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: '0px',
        }}
      >
        <div>
          <div class="govuk-form-group">
            <label
              class="govuk-label"
              for="file-upload-1"
              style={{ marginTop: '10px' }}
            >
              Upload a photo (maximum 10)
            </label>

            {uploadSuccess && (
              <section
                class="lbh-page-announcement"
                style={{ marginBottom: '0px' }}
              >
                <h3 class="lbh-page-announcement__title">Upload successful</h3>
                <div class="lbh-page-announcement__content">
                  Photos have been added to the workOrder
                </div>
              </section>
            )}

            {requestError && (
              <section class="lbh-page-announcement lbh-page-announcement--warning">
                <h3 class="lbh-page-announcement__title">
                  Failed to upload files
                </h3>
                <div class="lbh-page-announcement__content">{requestError}</div>
              </section>
            )}

            <input
              ref={inputRef}
              class="govuk-file-upload custom-file-input"
              type="file"
              multiple
              accept=".jpg, .jpeg, .png"
              onInput={(e) => {
                console.log(Object.values(e.target.files))
                setFiles(Object.values(e.target.files))
              }}
              style={{
                marginTop: '10px',
              }}
            />

            {validationError && (
              <p>
                <ErrorMessage label={validationError} />
              </p>
            )}

            {files.length > 0 && (
              <PhotoUploadPreview
                files={files}
                isUploading={isUploading}
                setFiles={setFiles}
              />
            )}

            {isUploading && (
              <div>
                <Spinner />
              </div>
            )}

            {files.length > 0 && (
              <div
                className="govuk-form-group lbh-form-group"
                style={{ marginTop: 0 }}
              >
                <Button
                  type="submit"
                  label="Upload"
                  disabled={!files && files.length === 0}
                  style={{
                    marginTop: '30px',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  )
}

export default UploadPhotosForm
