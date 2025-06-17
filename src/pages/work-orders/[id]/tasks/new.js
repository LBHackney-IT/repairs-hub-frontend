import Meta from '@/components/Meta'
import NewTaskForm from '@/components/Operatives/NewTaskForm'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import { OPERATIVE_ROLE } from '@/root/src/utils/auth/user'

const NewTaskPage = ({ query }) => {
  return (
    <>
      <Meta title={`Add New Work Order ${query.id}`} />
      <NewTaskForm workOrderReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

NewTaskPage.permittedRoles = [OPERATIVE_ROLE]

export default NewTaskPage
