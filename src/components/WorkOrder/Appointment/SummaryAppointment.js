import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { Button } from '../../Form'

const SummaryAppointment = ({
  date,
  timeSlot,
  comments,
  onEditAppointment,
}) => {
  const { handleSubmit } = useForm({})
  return (
    <div className="appointment-am-pm-form govuk-body-s govuk-grid-row">
      <div className="govuk-grid-column-full">
        <form
          role="form"
          id="appointment"
          onSubmit={handleSubmit(onEditAppointment)}
        >
          <div className="custom-padding">
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

SummaryAppointment.propTypes = {
  date: PropTypes.string,
  timeSlot: PropTypes.string,
  comments: PropTypes.string,
  onEditAppointment: PropTypes.func.isRequired,
}

export default SummaryAppointment
