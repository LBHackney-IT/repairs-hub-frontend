import Meta from '@/components/Meta'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import OperativeFormView from '@/components/Operatives/OperativeFormView'
import PropTypes from 'prop-types'

import { OPERATIVE_ROLE } from '@/utils/user'

const NewWorkOrderOperativePage = ({ query }) => {
  return (
    <>
      <Meta title={`Add new Operative for Work Order ${query.id}`} />

      <OperativeFormView workOrderReference={query.id} />
    </>
  )
}

export const getServerSideProps = getQueryProps

NewWorkOrderOperativePage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}

NewWorkOrderOperativePage.permittedRoles = [OPERATIVE_ROLE]

export default NewWorkOrderOperativePage
