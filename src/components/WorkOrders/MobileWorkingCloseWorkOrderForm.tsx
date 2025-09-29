import { useForm } from 'react-hook-form'
import BackButton from '../Layout/BackButton'
import TextArea from '../Form/TextArea'
import { PrimarySubmitButton } from '../Form'
import React, { useState, useEffect } from 'react'
import FollowOnRequestTypeOfWorkForm from './CloseWorkOrderFormComponents/FollowOnRequestTypeOfWorkForm'
import CloseWorkOrderFormReasonForClosing from './CloseWorkOrderFormComponents/CloseWorkOrderFormReasonForClosing'
import ControlledFileInput from '../WorkOrder/Photos/ControlledFileInput'
import FollowOnRequestMaterialsSupervisorCalledForm from './CloseWorkOrderFormComponents/FollowOnRequestMaterialsSupervisorCalledForm'
import FollowOnRequestMaterialsForm from './CloseWorkOrderFormComponents/FollowOnRequestMaterialsForm'
import useFormPersist from 'react-hook-form-persist'

const PAGES = {
  WORK_ORDER_STATUS: '1',
  FOLLOW_ON_DETAILS: '2',
}

const FIELD_NAMES_ON_FIRST_PAGE = new Set<string>([
  'reason',
  'followOnStatus',
  'workOrderFileUpload',
])

export interface CloseWorkOrderValues {
  workOrderFileUpload?: FileList | null
  followOnFileUpload?: FileList | null
  workOrderFiles?: File[]
  followOnFiles?: File[]
  workOrderPhotoDescription?: string
  finalReport?: string
  notes?: string
  followOnTypeDescription?: string
  stockItemsRequired?: boolean
  nonStockItemsRequired?: boolean
  materialNotes?: string
  additionalNotes?: string
  followOnPhotoDescription?: string
  supervisorCalled?: boolean
  isEmergency?: boolean
  isMultipleOperatives?: boolean
  otherTrade?: string
  reason?: string
  followOnStatus?: string
}

interface MobileWorkingCloseWorkOrderFormProps {
  workOrderReference: string
  onSubmit: (
    data: CloseWorkOrderValues,
    workOrderFiles: File[],
    followOnFiles: File[]
  ) => void
  isLoading: boolean
  presetValues?: Partial<CloseWorkOrderValues>
}

const MobileWorkingCloseWorkOrderForm = ({
  workOrderReference,
  onSubmit,
  isLoading,
  presetValues = {},
}: MobileWorkingCloseWorkOrderFormProps) => {
  const {
    handleSubmit,
    register,
    errors,
    setError,
    clearErrors,
    watch,
    getValues,
    trigger,
    setValue,
  } = useForm<CloseWorkOrderValues>({
    shouldUnregister: false,
    defaultValues: presetValues,
  })

  useFormPersist(`closeWorkOrder_${workOrderReference}`, {
    watch,
    setValue,
    storage: window.localStorage,
  })

  // Restore fields from presetValues if they exist
  const [workOrderFiles, setWorkOrderFiles] = useState<File[]>(
    presetValues?.workOrderFiles || []
  )
  const [followOnFiles, setFollowOnFiles] = useState<File[]>(
    presetValues?.followOnFiles || []
  )

  useEffect(() => {
    // Persist here because files not supported in useFormPersist
    setWorkOrderFiles(presetValues?.workOrderFiles || [])
    setFollowOnFiles(presetValues?.followOnFiles || [])
  }, [presetValues?.workOrderFiles, presetValues?.followOnFiles])

  useEffect(() => {
    if (watch('reason') !== 'Work Order Completed') {
      setValue('followOnStatus', null) // clear nested field
    }
  }, [watch('reason')])

  // Show validation error immediately for quick feedback
  useEffect(() => {
    if (currentPage === PAGES.WORK_ORDER_STATUS) {
      trigger('workOrderFileUpload')
    }
    if (currentPage === PAGES.FOLLOW_ON_DETAILS) {
      trigger('followOnFileUpload')
    }
  }, [workOrderFiles, followOnFiles])

  const selectedFurtherWorkRequired =
    watch('followOnStatus') === 'furtherWorkRequired'

  const [currentPage, setCurrentPage] = useState(PAGES.WORK_ORDER_STATUS)

  const viewFollowOnDetailsPage = () => {
    // validate first page before moving to second
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
          onSubmit(data, workOrderFiles, followOnFiles)
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
            canRaiseAFollowOn={true}
          />

          <div className="govuk-form-group lbh-form-group">
            <ControlledFileInput
              label="Work order photos"
              hint="Add photos showing the repair you completed (up to 10 photos)"
              files={workOrderFiles}
              setFiles={setWorkOrderFiles}
              validationError={errors?.workOrderFileUpload?.message}
              isLoading={isLoading}
              registerFunction={register}
              registerField="workOrderFileUpload"
              testId="WorkOrderPhotoUpload"
            />

            {workOrderFiles.length > 0 && (
              <TextArea
                name="workOrderPhotoDescription"
                label="Photo description"
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
            <PrimarySubmitButton
              id="submit-work-order-close"
              label="Close work order"
            />
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

            <div className="govuk-form-group lbh-form-group">
              <ControlledFileInput
                label="Follow on photos"
                hint="Add photos showing the follow on work needed (up to 10 photos)"
                files={followOnFiles}
                setFiles={setFollowOnFiles}
                validationError={errors?.followOnFileUpload?.message}
                isLoading={isLoading}
                registerFunction={register}
                registerField="followOnFileUpload"
                testId="FollowOnPhotoUpload"
              />
              {followOnFiles.length > 0 && (
                <TextArea
                  name="followOnPhotoDescription"
                  label="Photo description"
                  register={register}
                />
              )}
            </div>

            <PrimarySubmitButton
              id="submit-work-order-close"
              label="Close work order"
            />
          </div>
        )}
      </form>
    </div>
  )
}

export default MobileWorkingCloseWorkOrderForm
