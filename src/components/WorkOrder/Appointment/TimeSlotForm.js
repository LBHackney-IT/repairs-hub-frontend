import PropTypes from 'prop-types'
import Radios from '../../Form/Radios/Radios'
import { Button, TextArea } from '../../Form'
import { useForm } from 'react-hook-form'

const TimeSlotForm = ({
  date,
  availableSlots,
  onGetToSummary,
  comments,
  timeSlot,
  onCancel,
}) => {
  const { handleSubmit, register, errors } = useForm({})

  return (
    <div className="appointment-am-pm-form">
      <form
        role="form"
        id="appointment"
        onSubmit={handleSubmit(onGetToSummary)}
      >
        <div className="custom-padding">
          <h2>{date}</h2>
          <Radios
            label=""
            name="options"
            options={availableSlots['slots'].map((slot) => {
              let text =
                slot['description'] == 'AM Slot'
                  ? 'AM 8:00 -12:00'
                  : 'PM 12:00-4:00'
              return {
                text: text,
                value: text,
                defaultChecked: text == timeSlot,
              }
            })}
            register={register({ required: 'Please select a time slot' })}
            error={errors && errors.options}
          />
          <TextArea
            className="appointment-text-area"
            name="comments"
            label="Comments"
            register={register({
              required: 'Please add comments',
            })}
            error={errors && errors.comments}
            defaultValue={comments}
          />
        </div>
        <div className="govuk-button-group">
          <Button label="Submit" type="submit" />
          <Button type="button" label="Cancel" onClick={onCancel} />
        </div>
      </form>
    </div>
  )
}

TimeSlotForm.propTypes = {
  date: PropTypes.string,
  availability: PropTypes.array,
  onGetToSummary: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default TimeSlotForm
