import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { PrimarySubmitButton } from '../Form'
import BackButton from '../Layout/BackButton/BackButton'
import DatePicker from '../Form/DatePicker/DatePicker'
import isPast from 'date-fns/isPast'
import TimeInput from '../Form/TimeInput/TimeInput'
import TextArea from '../Form/TextArea/TextArea'

const CloseWorkOrderForm = ({
  reference,
  onGetToSummary,
  notes,
  time,
  date,
}) => {
  const { handleSubmit, register, control, errors } = useForm({})

  return (
    <div>
      <BackButton />
      <h1 className="lbh-heading-l">Update work order: {reference}</h1>
      <form role="form" onSubmit={handleSubmit(onGetToSummary)}>
        <DatePicker
          name="date"
          label="Select completion date"
          register={register({
            required: 'Please pick completion date',
            validate: (value) =>
              isPast(new Date(value)) ||
              'Please select a date that is in the past',
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
  )
}

CloseWorkOrderForm.propTypes = {
  reference: PropTypes.string.isRequired,
  onGetToSummary: PropTypes.func.isRequired,
  notes: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date),
}

export default CloseWorkOrderForm
