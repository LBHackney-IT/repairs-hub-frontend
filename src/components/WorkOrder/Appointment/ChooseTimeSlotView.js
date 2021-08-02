import PropTypes from 'prop-types'
import TimeSlotForm from './TimeSlotForm'
import AppointmentSummary from './AppointmentSummary'
import { useState } from 'react'
import { buildScheduleAppointmentData } from '../../../utils/hact/workOrderSchedule/scheduleAppointment'
import { getAppointmentReference } from '../../../utils/appointments'
import { buildDataFromScheduleAppointment } from '../../../utils/hact/workOrderStatusUpdate/notesForm'

const ChooseTimeSlotView = ({
  date,
  availableSlots,
  onCancel,
  updateOnSummaryPageState,
  workOrderReference,
  makePostRequest,
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

  const onCreateWorkOrder = () => {
    const appointmentReference = getAppointmentReference(
      availableSlots,
      timeSlot
    )
    const appointmentData = buildScheduleAppointmentData(
      workOrderReference,
      appointmentReference
    )
    const commentsForJobStatus = buildDataFromScheduleAppointment(
      workOrderReference,
      comments
    )
    makePostRequest(
      appointmentData,
      comments,
      date,
      timeSlot,
      commentsForJobStatus
    )
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
          onCreateWorkOrder={onCreateWorkOrder}
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
  workOrderReference: PropTypes.string.isRequired,
  makePostRequest: PropTypes.func.isRequired,
}

export default ChooseTimeSlotView
