import PropTypes from 'prop-types'
import TimeSlotForm from './TimeSlotForm'
import SummaryAppointment from './SummaryAppointment'
import { useState } from 'react'

const ChooseTimeSlotView = ({
  date,
  availableSlots,
  onCancel,
  isOnSummaryPage,
}) => {
  const [showSummary, setShowSummary] = useState(false)
  const [timeSlot, setTimeSlot] = useState('')
  const [comments, setComments] = useState('')

  const onEditAppointment = () => {
    setShowSummary(false)
    isOnSummaryPage()
  }
  const onGetToSummary = (e) => {
    setTimeSlot(e.options)
    setComments(e.comments)
    setShowSummary(true)
    isOnSummaryPage()
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
  date: PropTypes.string.isRequired,
  availableSlots: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  isOnSummaryPage: PropTypes.func.isRequired,
}

export default ChooseTimeSlotView
