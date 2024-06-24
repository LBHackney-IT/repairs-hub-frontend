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
import { useEffect, useState } from 'react'

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

  const showFollowOnRadioOptions = watch('reason') === 'Work Order Completed' || watch('reason') === undefined


  console.log(watch('reason'))

  // === 'Work Order Completed'

  const newOptions = CLOSURE_STATUS_OPTIONS.map((r) => {
    return {
      text: r.text,
      value: r.value,
      defaultChecked: r.value === 'Work Order Completed',
      children:
        r.value === 'Work Order Completed' && showFollowOnRadioOptions ? (
          <VisitCompleteFurtherOptions register={register} errors={errors} />
        ) : null,
    }
  })

  // useEffect(() => {
  //   console.log({ showFollowOnRadioOptions })
  // }, [showFollowOnRadioOptions])

  watch('reason', (data) => {
    console.log({ data })
  })

  // console.log({ values: getValues()?.reason })

  return (
    <div>
      <BackButton />
      <h1 className="lbh-heading-h2">{`Close work order: ${reference}`}</h1>

      {/* <p>Show: {showFollowOnRadioOptions ? 'TRUE' : 'FALSE'}</p> */}

      <form role="form" onSubmit={handleSubmit(onSubmit)}>
        {/* <Radios
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
        /> */}

        <Radios
          label="Select reason for closing"
          name="reason"
          options={newOptions}
          register={register({
            required: 'Please select a reason for closing the work order',
          })}
          error={errors && errors.reason}
        />

        <h2>Details of further work required</h2>

        <div class="govuk-form-group">
          <fieldset class="govuk-fieldset" aria-describedby="contact-hint">
            {/* <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
              <h1 class="govuk-fieldset__heading">
              Operative(s)
              </h1>
            </legend> */}
            {/* <div id="contact-hint" class="govuk-hint">
              Select one option.
            </div> */}
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input
                  class="govuk-radios__input"
                  id="contact"
                  name="contact"
                  type="radio"
                  value="email"
                  checked
                  data-aria-controls="conditional-contact"
                />
                <label class="govuk-label govuk-radios__label" for="contact">
                  Same trade
                </label>
              </div>
              <div class="govuk-radios__item">
                <input
                  class="govuk-radios__input"
                  id="contact-2"
                  name="contact"
                  type="radio"
                  value="phone"
                  data-aria-controls="conditional-contact-2"
                />
                <label class="govuk-label govuk-radios__label" for="contact-2">
                  Different trade (please specify)
                </label>
              </div>
              <div class="govuk-radios__conditional" id="conditional-contact">
                <ul>
                  {/* // Checkboxes */}
                  {[
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
                  ].map((x) => (
                    <li style={{ display: 'flex' }}>
                      <Checkbox
                        className="govuk-!-margin-0"
                        labelClassName="lbh-body-xs"
                        // key={index}
                        name={`ContractorReference`}
                        label={x}
                        register={register}
                        // checked={appliedFilters?.ContractorReference?.includes(
                        //   contractor.key
                        // )}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div
                class="govuk-radios__conditional govuk-radios__conditional--hidden"
                id="conditional-contact-2"
              >
                <div class="govuk-form-group">
                  <label class="govuk-label" for="contact-by-phone">
                    Phone number
                  </label>
                  <input
                    class="govuk-input govuk-!-width-one-third"
                    id="contact-by-phone"
                    name="contactByPhone"
                    type="tel"
                    autocomplete="tel"
                  />
                </div>
              </div>
              <div class="govuk-radios__item">
                <input
                  class="govuk-radios__input"
                  id="contact-3"
                  name="contact"
                  type="radio"
                  value="text"
                  data-aria-controls="conditional-contact-3"
                />
                <label class="govuk-label govuk-radios__label" for="contact-3">
                  Multiple operatives
                </label>
              </div>
              <div
                class="govuk-radios__conditional govuk-radios__conditional--hidden"
                id="conditional-contact-3"
              >
                <div class="govuk-form-group">
                  <label class="govuk-label" for="contact-by-text">
                    Mobile phone number
                  </label>
                  <input
                    class="govuk-input govuk-!-width-one-third"
                    id="contact-by-text"
                    name="contactByText"
                    type="tel"
                    autocomplete="tel"
                  />
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        {/* <Radios
          label="Operative(s)"
          name="operatives"
          options={[
            'Same trade',
            'Different trade (please specify)',
            'Multiple operatives',
          ]}
          register={register({
            required: 'Please select a reason for closing the work order',
          })}
          error={errors && errors.reason}
        /> */}

        <TextArea
          name="workRequiredDescription"
          label="Describe work required"
          register={register}
          error={errors && errors.notes}
          defaultValue={notes}
        />

        <Radios
          label="Materials"
          name="materials"
          options={['Stock items required', 'Non stock item required']}
          register={register({
            required: 'Please select a reason for closing the work order',
          })}
          error={errors && errors.reason}
        />

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
