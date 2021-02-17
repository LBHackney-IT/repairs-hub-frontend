import { AGENT_ROLE } from 'src/utils/user'
import AppointmentView from '../../../../components/WorkOrders/Appointment/AppointmentView'

const AppointmentPage = ({ query }) => {
  return <AppointmentView reference={query.id} />
}
export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

AppointmentPage.permittedRoles = [AGENT_ROLE]

export default AppointmentPage
