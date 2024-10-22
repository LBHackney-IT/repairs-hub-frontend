import { dateToStr } from '@/utils/date'

interface Props {
  workOrder: {
    appointment: {
      date: Date
      start: string
      end: string
    }
  }
}

const AppointmentDetailsInfo = (props: Props) => {
  const { workOrder } = props

  return (
    <p className="govuk-!-font-size-14">
      {dateToStr(new Date(workOrder.appointment.date))},{' '}
      {workOrder.appointment.start}-{workOrder.appointment.end}
    </p>
  )
}

export default AppointmentDetailsInfo
