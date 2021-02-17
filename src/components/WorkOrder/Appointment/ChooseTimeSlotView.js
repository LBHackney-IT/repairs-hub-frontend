import PropTypes from 'prop-types'
import TimeSlotForm from './TimeSlotForm'
import SummaryAppointment from './SummaryAppointment'
import { useState } from 'react'

const ChooseTimeSlotView = ({ date, availableSlots, onCancel }) => {
  const [showSummary, setShowSummary] = useState(false)
  const [timeSlot, setTimeSlot] = useState('')
  const [comments, setComments] = useState('')

  const onEditAppointment = (e) => {
    setShowSummary(false)
  }
  const onGetToSummary = (e) => {
    setTimeSlot(e.options)
    setComments(e.comments)
    setShowSummary(true)
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
        <SummaryAppointment
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
  date: PropTypes.string,
  availability: PropTypes.array,
  onCancel: PropTypes.func.isRequired,
}

export default ChooseTimeSlotView
