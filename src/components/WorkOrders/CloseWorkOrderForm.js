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
import { canAttendOwnWorkOrder } from '../../utils/userPermissions'
import { useContext } from 'react'
import UserContext from '../UserContext'
import WarningInfoBox from '../Template/WarningInfoBox'

const CloseWorkOrderForm = ({
  reference,
  closingByProxy,
  onSubmit,
  availableOperatives,
  assignedOperativesToWorkOrder,
  operativeAssignmentMandatory,
  notes,
  time,
  date,
  reason,
  dateRaised,
  selectedPercentagesToShowOnEdit,
  totalSMV,
}) => {
  const {
    handleSubmit,
    register,
    control,
    errors,
    trigger,
    getValues,
  } = useForm({})

  const { user } = useContext(UserContext)

  const CLOSURE_STATUS_OPTIONS = [
    {
      text: closingByProxy ? 'Work Order Completed' : 'Completed',
      value: 'Work Order Completed',
    },
    {
      text: closingByProxy ? 'No Access' : 'No access',
      value: 'No Access',
    },
  ]

  return (
    <>
      <div>
        <BackButton />

        <h1 className="lbh-heading-h2">
          {closingByProxy
            ? `Close work order: ${reference}`
            : 'Close work order'}
        </h1>

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

          {/* When closing on operative's behalf, you need to supply the date / time of closure */}
          {closingByProxy && (
            <>
              <DatePicker
                name="date"
                label="Select completion date"
                hint="For example, 15/05/2021"
                register={register({
                  required: 'Please pick completion date',
                  validate: {
                    isInThePast: (value) =>
                      isPast(new Date(value)) ||
                      'Please select a date that is in the past',
                    isLaterThanRaisedDate: (value) =>
                      new Date(value) >
                        new Date(new Date(dateRaised).toDateString()) ||
                      `Completion date must be on or after ${new Date(
                        dateRaised
                      ).toLocaleDateString('en-GB')}`,
                  },
                })}
                error={errors && errors.date}
                defaultValue={date ? date.toISOString().split('T')[0] : null}
              />
              <TimeInput
                name="time"
                label="Completion time"
                hint="Use 24h format. For example, 14:30"
                control={control}
                register={register}
                defaultValue={time}
                error={errors && errors.time}
              />
            </>
          )}

          {operativeAssignmentMandatory && (
            <SelectOperatives
              assignedOperativesToWorkOrder={assignedOperativesToWorkOrder}
              availableOperatives={availableOperatives}
              register={register}
              errors={errors}
              selectedPercentagesToShowOnEdit={selectedPercentagesToShowOnEdit}
              trigger={trigger}
              getValues={getValues}
              totalSMV={totalSMV}
            />
          )}

          <TextArea
            name="notes"
            label="Add notes"
            label={closingByProxy ? 'Add notes' : 'Final report'}
            register={register}
            error={errors && errors.notes}
            defaultValue={notes}
          />

          {canAttendOwnWorkOrder(user) && (
            <div className="govuk-!-margin-top-8">
              <WarningInfoBox
                header="Need to make a change?"
                text="Any changes to the work order must be made on paper."
              />
            </div>
          )}

          <PrimarySubmitButton
            label={closingByProxy ? 'Submit' : 'Close work order'}
          />
        </form>
      </div>
    </>
  )
}

CloseWorkOrderForm.propTypes = {
  reference: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
  notes: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date),
  reason: PropTypes.string,
  dateRaised: PropTypes.string,
  totalSMV: PropTypes.number.isRequired,
}

export default CloseWorkOrderForm
