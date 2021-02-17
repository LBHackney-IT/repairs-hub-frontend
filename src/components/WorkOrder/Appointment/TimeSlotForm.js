import PropTypes from 'prop-types'
import Radios from '../../Form/Radios/Radios'
import { TextArea } from '../../Form'
import { useForm } from 'react-hook-form'
import Button from 'src/components/Form/Button/Button'

const TimeSlotForm = ({
  onGetToSummary,
  date,
  comments,
  timeSlot,
  onCancel,
  availableSlots,
}) => {
  const { handleSubmit, register, errors } = useForm({})

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-full">
        <form
          role="form"
          id="appointment"
          className="timeslot-form govuk-!-padding-4"
          onSubmit={handleSubmit(onGetToSummary)}
        >
          <h2 className="govuk-heading-m">{date}</h2>
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
          <div className="button-pair">
            <Button
              type="button"
              isSecondary={true}
              label="Cancel"
              onClick={onCancel}
              className="lbh-button--repairs govuk-!-margin-right-4"
            />
            <Button label="Add" type="submit" className="lbh-button--repairs" />
          </div>
        </form>
      </div>
    </div>
  )
}

TimeSlotForm.propTypes = {
  onGetToSummary: PropTypes.func.isRequired,
  date: PropTypes.string.isRequired,
  comments: PropTypes.string.isRequired,
  timeSlot: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  availableSlots: PropTypes.object.isRequired,
}

export default TimeSlotForm
