import { useForm } from 'react-hook-form'
import { PrimarySubmitButton } from '../../Form'
import Button from 'src/components/Form/Button'

interface Props {
  timeSlot: string
  date: string
  comments: string
  onEditAppointment?: () => void
  onCreateWorkOrder?: () => void
}

const AppointmentSummary = ({
  timeSlot,
  date,
  comments,
  onEditAppointment,
  onCreateWorkOrder,
}: Props) => {
  const { handleSubmit } = useForm({})

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <form
            role="form"
            id="appointment"
            className="timeslot-form govuk-!-padding-4"
            onSubmit={handleSubmit(onEditAppointment)}
          >
            <div className="am-pm-slots-padding">
              <h2 className="lbh-heading-h2">Appointment Details:</h2>
              <p className="lbh-body">{date}</p>
              <p className="lbh-body">{timeSlot.split(' ')[0]}</p>
              <br />
              <p className="lbh-body">Comments: {comments}</p>
              <div className="button-pair">
                <Button
                  width="one-third"
                  label="Change"
                  type="submit"
                  isSecondary={true}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <br />
      <PrimarySubmitButton
        width="one-third"
        label="Book appointment"
        type="button"
        onClick={onCreateWorkOrder}
      />
    </>
  )
}

export default AppointmentSummary
