import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { Checkbox, PrimarySubmitButton } from '../Form'
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

const AVAILABLE_TRADES = [
  'Carpentry',
  'Drainage',
  'Gas',
  'Electrical',
  'Multitrade',
  'Painting',
  'Plumbing',
  'Roofing',
  'UPVC',
  'Other (please specify)',
]

const VisitCompleteFurtherOptions = (props) => {
  const { register, errors } = props

  return (
    <Radios
      // label="Select reason for closing"
      name="followOnStatus"
      options={['No further work required', 'Further work required']}
      register={register({
        required: 'Please select a reason for closing the work order',
      })}
      error={errors && errors.reason}
    />
  )
}

const DifferentTradesFurtherOptions = (props) => {
  const { register } = props

  return (
    <div>
      <ul>
        {/* // Checkboxes */}
        {AVAILABLE_TRADES.map((x) => (
          <li style={{ display: 'flex' }}>
            <Checkbox
              className="govuk-!-margin-0"
              labelClassName="lbh-body-xs"
              // key={index}
              name={`ContractorReference`}
              label={x}
              register={register}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

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
    watch,
  } = useForm({})

  const [startTimeIsRequired, setStartTimeIsRequired] = useState(false)

  // startTime is required when startDate is set
  const onStartDateChange = (e) => {
    setStartTimeIsRequired(e.target.value !== '')
  }

  const showFollowOnRadioOptions =
    watch('reason') === 'Work Order Completed' || watch('reason') === undefined // undefined if visible when default option

  const showDifferentTrades = watch('operatives') === 'Different trade(s)'

  const newReasonOptions = CLOSURE_STATUS_OPTIONS.map((r) => {
    return {
      ...r,
      defaultChecked: r.value === 'Work Order Completed',
      children:
        r.value === 'Work Order Completed' && showFollowOnRadioOptions ? (
          <VisitCompleteFurtherOptions register={register} errors={errors} />
        ) : null,
    }
  })

  const operativeOptions = [
    {
      text: 'Same trade',
      value: 'Same trade',
    },
    {
      text: 'Different trade(s)',
      value: 'Different trade(s)',
      children: showDifferentTrades && (
        <DifferentTradesFurtherOptions register={register} errors={errors} />
      ),
    },
    {
      text: 'Multiple operatives',
      value: 'Multiple operatives',
    },
  ]

  return (
    <div>
      <BackButton />
      <h1 className="lbh-heading-h2">{`Close work order: ${reference}`}</h1>

      {/* <p>Show: {showFollowOnRadioOptions ? 'TRUE' : 'FALSE'}</p> */}

      <form role="form" onSubmit={handleSubmit(onSubmit)}>
        <Radios
          label="Select reason for closing"
          name="reason"
          options={newReasonOptions}
          register={register({
            required: 'Please select a reason for closing the work order',
          })}
          error={errors && errors.reason}
        />

        <h3>Details of further work required</h3>

        {/* operativeOptions */}

        <Radios
          label="Operative(s)"
          name="operatives"
          options={operativeOptions}
          register={register({
            required: 'Please select a reason for closing the work order',
          })}
          error={errors && errors.reason}
        />

        <TextArea
          name="workRequiredDescription"
          label="Describe work required"
          register={register}
          error={errors && errors.notes}
          defaultValue={notes}
        />

        <fieldset>
          <label className={`govuk-label govuk-label--m`} htmlFor={name}>
            Materials
          </label>

          <ul>
            {/* // Checkboxes */}
            {['Stock items required', 'Non stock items required'].map((x) => (
              <li style={{ display: 'flex' }}>
                <Checkbox
                  className="govuk-!-margin-0"
                  labelClassName="lbh-body-xs"
                  // key={index}
                  name={`yeet`}
                  label={x}
                  register={register}
                />
              </li>
            ))}
          </ul>
        </fieldset>

        <TextArea
          name="materialsRequired"
          label="Materials required"
          register={register}
          error={errors && errors.notes}
          defaultValue={notes}
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
