import PropTypes from 'prop-types'
import TimeSlotForm from './TimeSlotForm'
import AppointmentSummary from './AppointmentSummary'
import { useState } from 'react'

const ChooseTimeSlotView = ({
  date,
  availableSlots,
  onCancel,
  updateOnSummaryPageState,
}) => {
  const [showSummary, setShowSummary] = useState(false)
  const [timeSlot, setTimeSlot] = useState('')
  const [comments, setComments] = useState('')

  const onEditAppointment = () => {
    setShowSummary(false)
    updateOnSummaryPageState()
  }
  const onGetToSummary = (e) => {
    setTimeSlot(e.options)
    setComments(e.comments)
    setShowSummary(true)
    updateOnSummaryPageState()
  }

  return (
    <>
      {!showSummary ? (
        <TimeSlotForm
          onGetToSummary={onGetToSummary}
          date={date}
          comments={comments}
          timeSlot={timeSlot}
          onCancel={onCancel}
          availableSlots={availableSlots}
        />
      ) : (
        <AppointmentSummary
          timeSlot={timeSlot}
          date={date}
          comments={comments}
          onEditAppointment={onEditAppointment}
        />
      )}
    </>
  )
}

ChooseTimeSlotView.propTypes = {
  date: PropTypes.string.isRequired,
  availableSlots: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  updateOnSummaryPageState: PropTypes.func.isRequired,
}

export default ChooseTimeSlotView
