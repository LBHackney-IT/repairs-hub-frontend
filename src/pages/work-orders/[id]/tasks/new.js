import Meta from '../../../../components/Meta'
import NewTaskView from '../../../../components/Operatives/NewTaskView'
import { getQueryProps } from '../../../../utils/helpers/serverSideProps'

import { OPERATIVE_ROLE } from '../../../../utils/user'

const NewTaskPage = ({ query }) => {
  return (
    <>
      <Meta title={`Work Order ${query.id}`} />
      <NewTaskView workOrderReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

NewTaskPage.permittedRoles = [OPERATIVE_ROLE]

export default NewTaskPage
