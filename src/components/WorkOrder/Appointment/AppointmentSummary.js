import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { Button } from '../../Form'

const AppointmentSummary = ({
  timeSlot,
  date,
  comments,
  onEditAppointment,
}) => {
  const { handleSubmit } = useForm({})
  return (
    <div className="appointment-am-pm-form">
      <div className="govuk-grid-column-full">
        <form
          role="form"
          id="appointment"
          onSubmit={handleSubmit(onEditAppointment)}
        >
          <div className="am-pm-slots-padding">
            <h2>Appointment Details:</h2>
            <p>{date}</p>
            <p>{timeSlot.split(' ')[0]}</p>
            <br />
            <p>Comments: {comments}</p>
            <Button width="one-third" label="Change" type="submit" />
          </div>
        </form>
      </div>
    </div>
  )
}

AppointmentSummary.propTypes = {
  timeSlot: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  comments: PropTypes.string.isRequired,
  onEditAppointment: PropTypes.func.isRequired,
}

export default AppointmentSummary
