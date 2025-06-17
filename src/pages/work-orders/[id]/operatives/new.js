import Meta from '@/components/Meta'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import OperativeFormView from '@/components/Operatives/OperativeFormView'

import { OPERATIVE_ROLE } from 'src/utils/user'

const NewWorkOrderOperativePage = ({ query }) => {
  return (
    <>
      <Meta title={`Add new Operative for Work Order ${query.id}`} />

      <OperativeFormView workOrderReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

NewWorkOrderOperativePage.permittedRoles = [OPERATIVE_ROLE]

export default NewWorkOrderOperativePage
