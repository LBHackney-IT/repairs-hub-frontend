import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { PrimarySubmitButton } from '../Form'
import BackButton from '../Layout/BackButton/BackButton'
import DatePicker from '../Form/DatePicker/DatePicker'
import isPast from 'date-fns/isPast'
import TimeInput from '../Form/TimeInput/TimeInput'
import TextArea from '../Form/TextArea/TextArea'
import Radios from '../Form/Radios/Radios'
import SelectOperatives from '../Operatives/SelectOperatives'

const CloseWorkOrderForm = ({
  reference,
  onGetToSummary,
  availableOperatives,
  assignedOperativesToWorkOrder,
  operativeAssignmentMandatory,
  notes,
  time,
  date,
  reason,
  dateRaised,
  selectedPercentagesToShowOnEdit,
}) => {
  const {
    handleSubmit,
    register,
    control,
    errors,
    trigger,
    getValues,
  } = useForm({})

  return (
    <>
      <div>
        <BackButton />
        <h1 className="lbh-heading-h1">Close work order: {reference}</h1>
        <form role="form" onSubmit={handleSubmit(onGetToSummary)}>
          <Radios
            label="Select reason for closing"
            name="reason"
            options={['Work Order Completed', 'No Access'].map((r) => {
              return {
                text: r,
                value: r,
                defaultChecked: r == reason,
              }
            })}
            register={register({
              required: 'Please select a reason for closing the work order',
            })}
            error={errors && errors.reason}
          />
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

          {operativeAssignmentMandatory && (
            <SelectOperatives
              assignedOperativesToWorkOrder={assignedOperativesToWorkOrder}
              availableOperatives={availableOperatives}
              register={register}
              errors={errors}
              selectedPercentagesToShowOnEdit={selectedPercentagesToShowOnEdit}
              trigger={trigger}
              getValues={getValues}
            />
          )}

          <TextArea
            name="notes"
            label="Add notes"
            register={register}
            error={errors && errors.notes}
            defaultValue={notes}
          />
          <PrimarySubmitButton label="Submit" />
        </form>
      </div>
    </>
  )
}

CloseWorkOrderForm.propTypes = {
  reference: PropTypes.number.isRequired,
  onGetToSummary: PropTypes.func.isRequired,
  notes: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date),
  reason: PropTypes.string,
  dateRaised: PropTypes.string,
}

export default CloseWorkOrderForm
