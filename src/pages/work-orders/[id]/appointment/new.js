import {
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
} from 'src/models/user'
import Meta from '../../../../components/Meta'
import AppointmentView from '../../../../components/WorkOrder/Appointment/AppointmentView'

const AppointmentPage = ({ query }) => {
  return (
    <>
      <Meta title={`New appointment for Work Order ${query.id}`} />
      <AppointmentView
        workOrderReference={query.id}
        successText={
          query.newOrder ? 'Repair work order created' : 'Appointment created'
        }
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

AppointmentPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
]

export default AppointmentPage
