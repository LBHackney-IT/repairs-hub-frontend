import TimeSlotForm from './TimeSlotForm'
import AppointmentSummary from './AppointmentSummary'
import { useState } from 'react'
import { buildScheduleAppointmentData } from '@/utils/hact/workOrderSchedule/scheduleAppointment'
import { getAppointmentReference } from '@/utils/appointments'
import { buildDataFromScheduleAppointment } from '@/utils/hact/jobStatusUpdate/notesForm'

interface Props {
  date: string
  availableSlots: any
  onCancel: (...args: any[]) => any
  updateOnSummaryPageState: (...args: any[]) => any
  workOrderReference: string
  makePostRequest: (...args: any[]) => any
}

const ChooseTimeSlotView = ({
  date,
  availableSlots,
  onCancel,
  updateOnSummaryPageState,
  workOrderReference,
  makePostRequest,
}: Props) => {
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

export default ChooseTimeSlotView
