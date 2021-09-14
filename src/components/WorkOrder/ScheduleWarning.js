import WarningInfoBox from '../Template/WarningInfoBox'

const ScheduleWarning = ({ hasExistingAppointment }) => {
  const warningText = `Contact the operative before ${
    hasExistingAppointment ? 'rescheduling' : 'scheduling'
  }`

  return <WarningInfoBox header="Appointment is today" text={warningText} />
}

export default ScheduleWarning
