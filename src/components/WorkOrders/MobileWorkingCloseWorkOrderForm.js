import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import BackButton from '../Layout/BackButton'
import TextArea from '../Form/TextArea'
import { PrimarySubmitButton } from '../Form'
import { useState } from 'react'
import FollowOnRequestMaterialsForm from './CloseWorkOrderFormComponents/FollowOnRequestMaterialsForm'
import FollowOnRequestTypeOfWorkForm from './CloseWorkOrderFormComponents/FollowOnRequestTypeOfWorkForm'
import CloseWorkOrderFormReasonForClosing from './CloseWorkOrderFormComponents/CloseWorkOrderFormReasonForClosing'
import validateFileUpload from '../WorkOrder/Photos/hooks/validateFileUpload'
import ControlledFileInput from '../WorkOrder/Photos/ControlledFileInput'
import CheckboxSmall from '../Form/CheckboxSmall'

const PAGES = {
  WORK_ORDER_STATUS: '1',
  FOLLOW_ON_DETAILS: '2',
}

const FIELD_NAMES_ON_FIRST_PAGE = [
  'reason',
  'followOnStatus',
  'fileUpload',
  'description',
]

const MobileWorkingCloseWorkOrderForm = ({ onSubmit, isLoading }) => {
  const {
    handleSubmit,
    register,
    errors,
    setError,
    clearErrors,
    watch,
    getValues,
    trigger,
  } = useForm({
    shouldUnregister: false,
  })

  const selectedFurtherWorkRequired =
    watch('followOnStatus') === 'furtherWorkRequired'

  const [currentPage, setCurrentPage] = useState(PAGES.WORK_ORDER_STATUS)

  const [closeWithoutPhotos, setCloseWithoutPhotos] = useState(false)
  // So we dont show the error immediately
  const [photosTouched, setPhotosTouched] = useState(false)

  const viewFollowOnDetailsPage = (e) => {
    e.preventDefault()

    try {
      trigger(FIELD_NAMES_ON_FIRST_PAGE)
    } catch (e) {
      console.error('Trigger failed', e)
    }

    if (Object.keys(errors).length > 0) return

    // validate file uploaded
    if (files.length === 0 && !closeWithoutPhotos) {
      // user must confirm submit without photos
      return
    }

    setCurrentPage(PAGES.FOLLOW_ON_DETAILS)
  }

  const viewWorkOrderStatusPage = () => {
    setCurrentPage(PAGES.WORK_ORDER_STATUS)
  }

  const [files, setFiles] = useState([])

  return (
    <div className="mobile-working-close-work-order-form">
      <BackButton
        // if on second page, override back button
        onClick={
          currentPage === PAGES.FOLLOW_ON_DETAILS
            ? viewWorkOrderStatusPage
            : null
        }
      />

      <form
        role="form"
        onSubmit={handleSubmit((data) => {
          if (files.length === 0 && !closeWithoutPhotos) {
            // user must confirm submit without photos
            return
          }

          onSubmit(data, files)
        })}
      >
        <div
          style={{
            display: currentPage === PAGES.WORK_ORDER_STATUS ? 'block' : 'none',
          }}
        >
          <h1 className="lbh-heading-h2">Close work order</h1>

          <CloseWorkOrderFormReasonForClosing
            register={register}
            errors={errors}
            watch={watch}
          />

          <div className="govuk-form-group lbh-form-group">
            <ControlledFileInput
              files={files}
              setFiles={setFiles}
              validationError={errors?.fileUpload?.message}
              isLoading={isLoading}
              register={register('fileUpload', {
                validate: () => {
                  setPhotosTouched(true)

                  const validation = validateFileUpload(files)

                  if (validation === null) return true
                  return validation
                },
              })}
            />

            {files.length > 0 && (
              <TextArea
                name="description"
                label="Photo description"
                showAsOptional
                register={register}
              />
            )}

            {files.length === 0 && photosTouched && (
              <div className="lbh-page-announcement lbh-page-announcement--warning">
                <h3 className="lbh-page-announcement__title">
                  No photos were selected
                </h3>
                <div className="lbh-page-announcement__content">
                  <div>
                    {' '}
                    Adding photos will help improve the identification of
                    follow-ons required and reduce errors.
                  </div>

                  <div style={{ marginTop: '30px !important' }}>
                    <CheckboxSmall
                      className="govuk-!-margin-0"
                      labelClassName="lbh-body-xs govuk-!-margin-0 govuk-!-margin-bottom-5"
                      name={'closeWorkOrderWithoutPhotos'}
                      label={'I want to close the work order without photos'}
                      onChange={() => {
                        setCloseWithoutPhotos(() => !closeWithoutPhotos)
                      }}
                      checked={closeWithoutPhotos}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <TextArea
            name="notes"
            label="Final report"
            register={register}
            error={errors && errors.notes}
          />

          {selectedFurtherWorkRequired ? (
            <PrimarySubmitButton
              label="Add details"
              type="button"
              onClick={viewFollowOnDetailsPage}
            />
          ) : (
            <PrimarySubmitButton label={`Close work order`} />
          )}
        </div>

        <div
          style={{
            display: currentPage === PAGES.FOLLOW_ON_DETAILS ? 'block' : 'none',
          }}
        >
          <h1 className="lbh-heading-h2">Details of further work required</h1>

          <FollowOnRequestTypeOfWorkForm
            errors={errors}
            register={register}
            getValues={getValues}
            setError={setError}
            clearErrors={clearErrors}
            watch={watch}
          />

          <FollowOnRequestMaterialsForm
            register={register}
            getValues={getValues}
            errors={errors}
          />

          <TextArea
            name="additionalNotes"
            label="Additional notes"
            register={register}
            error={errors && errors.additionalNotes}
          />

          <PrimarySubmitButton label="Close work order" />
        </div>
      </form>
    </div>
  )
}

MobileWorkingCloseWorkOrderForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default MobileWorkingCloseWorkOrderForm
