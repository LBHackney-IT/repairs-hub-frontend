import Spinner from '../../Spinner'
import { Button, TextArea } from '../../Form'
import useFileUpload from './hooks/useFileUpload'
import ControlledFileInput from './ControlledFileInput'

const UploadPhotosForm = ({ workOrderReference, onSuccess }) => {
  const {
    files,
    handleSubmit,
    uploadSuccess,
    setFiles,
    validationError,
    loadingStatus,
    requestError,
  } = useFileUpload(workOrderReference, onSuccess)

  return (
    <>
      <form onSubmit={handleSubmit} className="govuk-!-margin-0">
        <div>
          {uploadSuccess && (
            <section class="lbh-page-announcement govuk-!-margin-top-3">
              <h3 class="lbh-page-announcement__title">Upload successful</h3>
              <div class="lbh-page-announcement__content">{uploadSuccess}</div>
            </section>
          )}

          {requestError && (
            <section class="lbh-page-announcement lbh-page-announcement--warning">
              <h3 class="lbh-pageW-announcement__title">
                Failed to upload files
              </h3>
              <div class="lbh-page-announcement__content">{requestError}</div>
            </section>
          )}

          <ControlledFileInput
            files={files}
            setFiles={setFiles}
            validationError={validationError}
            isLoading={loadingStatus !== null}
            disabled={loadingStatus !== null}
          />

          {files.length > 0 && (
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-one-half-from-desktop">
                <TextArea
                  name="description"
                  label="Description"
                  placeholder="Write a description..."
                />
              </div>
            </div>
          )}

          {loadingStatus && (
            <div
              className="govuk-body"
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '15px',
              }}
            >
              <Spinner />
              <div style={{ marginLeft: '15px', marginTop: 0 }}>
                {loadingStatus}
              </div>
            </div>
          )}

          {files.length > 0 && (
            <div className="govuk-form-group lbh-form-group govuk-!-margin-0">
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
      </form>
    </>
  )
}

export default UploadPhotosForm
