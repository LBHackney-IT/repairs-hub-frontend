import {
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
} from 'src/utils/user'
import Meta from '@/components/Meta'
import AppointmentView from '@/components/WorkOrder/Appointment/AppointmentView'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import type { PageProps } from '@/types/page'

const AppointmentPage = ({ query }: PageProps<{ id: string }>) => {
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

AppointmentPage.permittedRoles = [
  AGENT_ROLE,
  CONTRACT_MANAGER_ROLE,
  AUTHORISATION_MANAGER_ROLE,
]

export default AppointmentPage
