import {
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
} from 'src/utils/user'
import AppointmentView from '../../../../components/WorkOrder/Appointment/AppointmentView'

const AppointmentPage = ({ query }) => {
  return <AppointmentView workOrderReference={query.id} />
}
export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

AppointmentPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
]

export default AppointmentPage
