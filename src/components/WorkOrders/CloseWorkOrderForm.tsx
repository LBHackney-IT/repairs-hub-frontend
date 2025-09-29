import { useForm } from 'react-hook-form'
import { PrimarySubmitButton } from '../Form'
import BackButton from '../Layout/BackButton'
import DatePicker from '../Form/DatePicker'
import isPast from 'date-fns/isPast'
import TimeInput from '../Form/TimeInput'
import TextArea from '../Form/TextArea'
import Radios from '../Form/Radios'
import SelectOperatives from '../Operatives/SelectOperatives'
import {
  BONUS_PAYMENT_TYPE,
  CLOSE_TO_BASE_PAYMENT_TYPE,
  OVERTIME_PAYMENT_TYPE,
  optionsForPaymentType,
} from '../../utils/paymentTypes'
import { useContext, useEffect, useState } from 'react'
import FollowOnRequestTypeOfWorkForm from './CloseWorkOrderFormComponents/FollowOnRequestTypeOfWorkForm'
import FollowOnRequestMaterialsForm from './CloseWorkOrderFormComponents/FollowOnRequestMaterialsForm'
import CloseWorkOrderFormReasonForClosing from './CloseWorkOrderFormComponents/CloseWorkOrderFormReasonForClosing'
import ControlledFileInput from '../WorkOrder/Photos/ControlledFileInput'
import { canRaiseAFollowOn } from '../../utils/userPermissions'
import UserContext from '../UserContext'
import FollowOnRequestMaterialsSupervisorCalledForm from './CloseWorkOrderFormComponents/FollowOnRequestMaterialsSupervisorCalledForm'
import { Operative } from '../../models/operativeModel'

interface Props {
  reference: string
  onSubmit: (formData: any, files: any) => void
  notes: string
  completionTime: string
  completionDate: string
  startTime?: string
  startDate: string
  reason?: string
  dateRaised: string
  totalSMV: number
  jobIsSplitByOperative: boolean
  paymentType: string
  existingStartTime: boolean

  availableOperatives: Operative[]
  assignedOperativesToWorkOrder: Operative[]
  operativeAssignmentMandatory: boolean
  selectedPercentagesToShowOnEdit: any[]
  followOnStatus: string
  followOnData: any
  isLoading: boolean
  defaultFiles: any[]
  description: string
}

const CloseWorkOrderForm = (props: Props) => {
  const {
    reference,
    onSubmit,
    availableOperatives,
    assignedOperativesToWorkOrder,
    operativeAssignmentMandatory,
    notes,
    completionTime,
    completionDate,
    startTime,
    startDate,
    dateRaised,
    selectedPercentagesToShowOnEdit,
    totalSMV,
    jobIsSplitByOperative,
    paymentType,
    existingStartTime,
    reason,
    followOnStatus,
    followOnData,
    isLoading,
    defaultFiles,
    description,
  } = props

  const {
    handleSubmit,
    register,
    control,
    errors,
    trigger,
    getValues,
    watch,
    clearErrors,
    setError,
  } = useForm({})

  const { user } = useContext(UserContext)

  const [startTimeIsRequired, setStartTimeIsRequired] = useState(false)

  // startTime is required when startDate is set
  const onStartDateChange = (e) => {
    setStartTimeIsRequired(e.target.value !== '')
  }

  const [showFurtherWorkFields, setShowFurtherWorkFields] = useState(false)

  const followOnStatusWatchedValue = watch('followOnStatus')

  useEffect(() => {
    // When navigating back from summary page, the watch hook isnt updating
    // meaning the followOnStatus options arent visible
    // this awful code fixes that

    if (followOnStatusWatchedValue === undefined) {
      setShowFurtherWorkFields(followOnStatus === 'furtherWorkRequired')
    } else {
      setShowFurtherWorkFields(
        followOnStatusWatchedValue === 'furtherWorkRequired'
      )
    }
  }, [followOnStatusWatchedValue])

  const [files, setFiles] = useState(defaultFiles ?? [])

  return (
    <div className="close-work-order-form">
      <BackButton />
      <h1 className="lbh-heading-h2">{`Close work order: ${reference}`}</h1>

      <form
        role="form"
        onSubmit={handleSubmit((data) => onSubmit(data, files))}
      >
        <CloseWorkOrderFormReasonForClosing
          register={register}
          errors={errors}
          watch={watch}
          defaultValues={{ reason, followOnStatus }}
          canRaiseAFollowOn={canRaiseAFollowOn(user)}
        />

        {showFurtherWorkFields && (
          <div
            style={{
              backgroundColor: '#f3f3f3',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'wrap',
              marginBottom: '10px',
            }}
          >
            <div style={{ flexBasis: '100%' }}>
              <h1 className="lbh-heading-h2">
                Details of further work required
              </h1>
            </div>

            <FollowOnRequestMaterialsSupervisorCalledForm
              register={register}
              errors={errors}
              followOnData={followOnData}
              hasWhiteBackground={true}
            />

            <FollowOnRequestTypeOfWorkForm
              errors={errors}
              register={register}
              getValues={getValues}
              setError={setError}
              clearErrors={clearErrors}
              watch={watch}
              followOnData={followOnData}
              hasWhiteBackground={true}
              isGrid={true}
            />

            <FollowOnRequestMaterialsForm
              register={register}
              getValues={getValues}
              errors={errors}
              followOnData={followOnData}
              hasWhiteBackground={true}
            />

            <TextArea
              name="additionalNotes"
              label="Additional notes"
              register={register}
              error={errors && errors.additionalNotes}
              defaultValue={followOnData?.additionalNotes ?? ''}
            />
          </div>
        )}

        <div className="govuk-form-group lbh-form-group">
          <ControlledFileInput
            files={files}
            setFiles={setFiles}
            validationError={errors?.fileUpload?.message}
            isLoading={isLoading}
            label="Photos"
            hint="Select all the photos you want to add (up to 10 photos)"
            registerFunction={register}
            registerField="fileUpload"
            testId="PhotoUploadForm"
            workOrderReference={reference}
          />

          {files.length > 0 && (
            <TextArea
              name="description"
              label="Photo description"
              register={register}
              error={errors && errors.description}
              defaultValue={description}
            />
          )}
        </div>

        {/* Start time cannot be changed once set by an operative */}
        {!existingStartTime && (
          <>
            <DatePicker
              name="startDate"
              label="Select start date (optional)"
              hint="For example, 15/05/2021"
              onChange={onStartDateChange}
              register={register({
                validate: {
                  isInThePast: (value) => {
                    if (value === '') return

                    return (
                      isPast(new Date(value)) ||
                      'Please select a date that is in the past'
                    )
                  },
                },
              })}
              error={errors && errors.startDate}
              defaultValue={
                startDate
                  ? new Date(startDate).toISOString().split('T')[0]
                  : null
              }
            />

            <TimeInput
              name="startTime"
              label="Start time"
              showAsOptional={true}
              hint="Use 24h format. For example, 14:30"
              control={control}
              required={startTimeIsRequired}
              register={register()}
              defaultValue={startTime}
              error={errors && errors['startTime']}
            />
          </>
        )}

        <DatePicker
          name="completionDate"
          label="Select completion date"
          hint="For example, 15/05/2021"
          register={register({
            required: 'Please pick completion date',
            validate: {
              isInThePast: (value) =>
                isPast(new Date(value)) ||
                'Please select a date that is in the past',
              isEqualOrLaterThanRaisedDate: (value) =>
                new Date(value) >=
                  new Date(new Date(dateRaised).toDateString()) ||
                `Completion date must be on or after ${new Date(
                  dateRaised
                ).toLocaleDateString('en-GB')}`,
            },
          })}
          error={errors && errors.completionDate}
          defaultValue={
            completionDate
              ? new Date(completionDate).toISOString().split('T')[0]
              : null
          }
        />

        <TimeInput
          name="completionTime"
          label="Completion time"
          hint="Use 24h format. For example, 14:30"
          control={control}
          required={true}
          register={register()}
          defaultValue={completionTime}
          error={errors && errors['completionTime']}
        />

        {operativeAssignmentMandatory && (
          <>
            <SelectOperatives
              assignedOperativesToWorkOrder={assignedOperativesToWorkOrder}
              availableOperatives={availableOperatives}
              register={register}
              errors={errors}
              selectedPercentagesToShowOnEdit={selectedPercentagesToShowOnEdit}
              trigger={trigger}
              getValues={getValues}
              totalSMV={totalSMV}
              jobIsSplitByOperative={jobIsSplitByOperative}
            />

            <Radios
              label="Payment type"
              name="paymentType"
              labelSize="s"
              options={optionsForPaymentType({
                paymentTypes: [
                  BONUS_PAYMENT_TYPE,
                  OVERTIME_PAYMENT_TYPE,
                  CLOSE_TO_BASE_PAYMENT_TYPE,
                ],
                currentPaymentType: paymentType,
              })}
              register={register({
                required: 'Provide payment type',
              })}
              error={errors && errors.paymentType}
            />
          </>
        )}

        <TextArea
          name="notes"
          label="Add notes"
          register={register}
          error={errors && errors.notes}
          defaultValue={notes}
        />

        <PrimarySubmitButton
          id="submit-work-order-close"
          label="Close work order"
        />
      </form>
    </div>
  )
}

export default CloseWorkOrderForm
