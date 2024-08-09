import {
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
} from 'src/utils/user'
import Meta from '@/components/Meta'
import AppointmentView from '@/components/WorkOrder/Appointment/AppointmentView'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import PropTypes from 'prop-types'

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

EditAppointmentPage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}

EditAppointmentPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
]

export default EditAppointmentPage
