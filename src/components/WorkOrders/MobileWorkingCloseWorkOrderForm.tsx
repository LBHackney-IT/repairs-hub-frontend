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
import FollowOnRequestMaterialsSupervisorCalledForm from './CloseWorkOrderFormComponents/FollowOnRequestMaterialsSupervisorCalledForm'

const PAGES = {
  WORK_ORDER_STATUS: '1',
  FOLLOW_ON_DETAILS: '2',
}

const FIELD_NAMES_ON_FIRST_PAGE = new Set<string>([
  'reason',
  'followOnStatus',
  'fileUpload',
])

const MobileWorkingCloseWorkOrderForm = ({
  onSubmit,
  isLoading,
  followOnFunctionalityEnabled,
}) => {
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

  const viewFollowOnDetailsPage = () => {
    trigger([...FIELD_NAMES_ON_FIRST_PAGE])

    if (
      Object.keys(errors).filter((key) => FIELD_NAMES_ON_FIRST_PAGE.has(key))
        .length > 0
    ) {
      console.info({ errors })
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
            followOnFunctionalityEnabled={followOnFunctionalityEnabled}
          />

          <div className="govuk-form-group lbh-form-group">
            <ControlledFileInput
              files={files}
              setFiles={setFiles}
              validationError={errors?.fileUpload?.message}
              isLoading={isLoading}
              register={register('fileUpload', {
                validate: () => {
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

        {currentPage === PAGES.FOLLOW_ON_DETAILS && (
          <div>
            <h1 className="lbh-heading-h2">Details of further work required</h1>

            <FollowOnRequestMaterialsSupervisorCalledForm
              register={register}
              errors={errors}
            />

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
        )}
      </form>
    </div>
  )
}

MobileWorkingCloseWorkOrderForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  followOnFunctionalityEnabled: PropTypes.bool.isRequired,
}

export default MobileWorkingCloseWorkOrderForm
