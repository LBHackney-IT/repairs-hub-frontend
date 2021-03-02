import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { PrimarySubmitButton } from '../../Form'
import Button from 'src/components/Form/Button/Button'

const AppointmentSummary = ({
  timeSlot,
  date,
  comments,
  onEditAppointment,
  onCreateWorkOrder,
}) => {
  const { handleSubmit } = useForm({})

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <form
            role="form"
            id="appointment"
            className="timeslot-form govuk-!-padding-4"
            onSubmit={handleSubmit(onEditAppointment)}
          >
            <div className="am-pm-slots-padding">
              <h2 className="govuk-heading-m">Appointment Details:</h2>
              <p className="govuk-body">{date}</p>
              <p className="govuk-body">{timeSlot.split(' ')[0]}</p>
              <br />
              <p className="govuk-body">Comments: {comments}</p>
              <div className="button-pair">
                <Button
                  width="one-third"
                  label="Change"
                  type="submit"
                  isSecondary={true}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <br />
      <PrimarySubmitButton
        width="one-third"
        label="Create work order"
        type="button"
        onClick={onCreateWorkOrder}
      />
    </>
  )
}

AppointmentSummary.propTypes = {
  timeSlot: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  comments: PropTypes.string.isRequired,
  onEditAppointment: PropTypes.func,
  onCreateWorkOrder: PropTypes.func,
}

export default AppointmentSummary
