import {
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
} from 'src/utils/user'
import Meta from '@/components/Meta'
import AppointmentView from '@/components/WorkOrder/Appointment/AppointmentView'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import PropTypes from 'prop-types'

const AppointmentPage = ({ query }) => {
  return (
    <>
      <Meta title={`New appointment for Work Order ${query.id}`} />
      <AppointmentView
        workOrderReference={query.id}
        successText={
          query.newOrder ? 'Work order created' : 'Appointment created'
        }
      />
    </>
  )
}

export const getServerSideProps = getQueryProps

AppointmentPage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
    newOrder: PropTypes.bool,
  }),
}

AppointmentPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
]

export default AppointmentPage
