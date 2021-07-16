import {
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
} from 'src/utils/user'
import Meta from '../../../../components/Meta'
import AppointmentView from '../../../../components/WorkOrder/Appointment/AppointmentView'

const EditAppointmentPage = ({ query }) => {
  return (
    <>
      <Meta title={`Reschedule appointment for Work Order ${query.id}`} />
      <AppointmentView
        workOrderReference={query.id}
        successText={'Appointment rescheduled'}
      />
    </>
  )
}
export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

EditAppointmentPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
]

export default EditAppointmentPage
