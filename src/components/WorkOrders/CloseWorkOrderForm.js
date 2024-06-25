import PropTypes from 'prop-types'
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
import { CLOSURE_STATUS_OPTIONS } from '@/utils/statusCodes'
import { useState } from 'react'

const CloseWorkOrderForm = ({
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
  reason,
  dateRaised,
  selectedPercentagesToShowOnEdit,
  totalSMV,
  jobIsSplitByOperative,
  paymentType,
  existingStartTime,
}) => {
  const {
    handleSubmit,
    register,
    control,
    errors,
    trigger,
    getValues,
  } = useForm({})

  const [startTimeIsRequired, setStartTimeIsRequired] = useState(false)

  // startTime is required when startDate is set
  const onStartDateChange = (e) => {
    setStartTimeIsRequired(e.target.value !== '')
  }

  return (
    <div>
      <BackButton />
      <h1 className="lbh-heading-h2">{`Close work order: ${reference}`}</h1>

      <form role="form" onSubmit={handleSubmit(onSubmit)}>
        <Radios
          label="Select reason for closing"
          name="reason"
          options={CLOSURE_STATUS_OPTIONS.map((r) => {
            return {
              text: r.text,
              value: r.value,
              defaultChecked: r.value === reason,
            }
          })}
          register={register({
            required: 'Please select a reason for closing the work order',
          })}
          error={errors && errors.reason}
        />

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
                startDate ? startDate.toISOString().split('T')[0] : null
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
            completionDate ? completionDate.toISOString().split('T')[0] : null
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

        <PrimarySubmitButton label="Close work order" />
      </form>
    </div>
  )
}

CloseWorkOrderForm.propTypes = {
  reference: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
  notes: PropTypes.string.isRequired,
  completionTime: PropTypes.string.isRequired,
  completionDate: PropTypes.instanceOf(Date),
  startTime: PropTypes.string,
  startDate: PropTypes.instanceOf(Date),
  reason: PropTypes.string,
  dateRaised: PropTypes.string,
  totalSMV: PropTypes.number.isRequired,
  jobIsSplitByOperative: PropTypes.bool.isRequired,
  paymentType: PropTypes.string,
  existingStartTime: PropTypes.bool.isRequired,
}

export default CloseWorkOrderForm
