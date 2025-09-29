import Spinner from '../../Spinner'
import { Button, TextArea } from '../../Form'
import useFileUpload from './hooks/useFileUpload'
import ControlledFileInput from './ControlledFileInput'
import useCloudwatchLogger from '@/root/src/utils/cloudwatchLogger'

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

  const cwLogger = useCloudwatchLogger(
    'PHOTOS',
    `${workOrderReference} | UploadPhotosForm`
  )

  return (
    <>
      <form onSubmit={handleSubmit} className="govuk-!-margin-0">
        <div>
          {uploadSuccess && (
            <section className="lbh-page-announcement govuk-!-margin-top-3">
              <h3 className="lbh-page-announcement__title">
                Upload successful
              </h3>
              <div className="lbh-page-announcement__content">
                {uploadSuccess}
              </div>
            </section>
          )}

          {requestError && (
            <section className="lbh-page-announcement lbh-page-announcement--warning">
              <h3 className="lbh-pageW-announcement__title">
                Failed to upload files
              </h3>
              <div className="lbh-page-announcement__content">
                {requestError}
              </div>
            </section>
          )}

          <div className="govuk-form-group lbh-form-group">
            <ControlledFileInput
              files={files}
              setFiles={setFiles}
              validationError={validationError}
              isLoading={loadingStatus !== null}
              disabled={loadingStatus !== null}
              label="Photo upload"
              hint="Select all the photos you want to add (up to 10 photos)"
              testId="PhotoUploadForm"
              cwLogger={cwLogger}
              workOrderReference={workOrderReference}
            />

            {files.length > 0 && (
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half-from-desktop">
                  <TextArea
                    name="description"
                    label="Photo description"
                    showAsOptional
                  />
                </div>
              </div>
            )}
          </div>

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
            <Button
              type="submit"
              label="Upload"
              disabled={!files && files.length === 0}
            />
          )}
        </div>
      </form>
    </>
  )
}

export default UploadPhotosForm
