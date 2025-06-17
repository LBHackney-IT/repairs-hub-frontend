import {
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
} from '@/root/src/utils/auth/user'
import Meta from '@/components/Meta'
import AppointmentView from '@/components/WorkOrder/Appointment/AppointmentView'
import { getQueryProps } from '@/utils/helpers/serverSideProps'

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

export const getServerSideProps = getQueryProps

EditAppointmentPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
]

export default EditAppointmentPage
