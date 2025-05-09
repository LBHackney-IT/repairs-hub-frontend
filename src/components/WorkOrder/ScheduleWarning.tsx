import WarningInfoBox from '../Template/WarningInfoBox'

interface Props {
  hasExistingAppointment: boolean
}

const ScheduleWarning = ({ hasExistingAppointment }: Props) => {
  const warningText = `Contact the operative before ${
    hasExistingAppointment ? 'rescheduling' : 'scheduling'
  }`

  return <WarningInfoBox header="Appointment is today" text={warningText} />
}

export default ScheduleWarning
